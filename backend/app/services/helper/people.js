import {
  XQodResourceDef, XQodUserSkill, XQodSkill, XQodUserCourse, XQodCourseUnitsUser, XQodCategory, XQodCourseUserQA,
  UserDetail, XQodApplication, XUserActivity, User, XQodCourse, XQodCourseSection, XQodCourseUnit, XQodCourseSectionQA,
  XQodCoursePrereqs, XQodJobCourse
} from '../../db/models'
import { createNewEntity, formatDate } from './common'
import { getOne } from './crud'
import Sequelize, { Op } from 'sequelize'
import _ from 'lodash'
import { generateRandomUniqueIdString } from '../../utils/generateId'
import config from '../../../config/app'

export async function createAgentJobProfile ({
  user_id,
  skillIds,
  desired_min_pay,
  desired_max_pay,
  desired_languages,
  status,
  work_title,
  work_overview
}) {
  const agentResourceDef = await createNewEntity({
    model: XQodResourceDef,
    data: {
      user_id,
      desired_min_pay,
      desired_max_pay,
      desired_languages,
      status
    }
  })

  // Add Work title and overview
  await UserDetail.update({
    work_title,
    work_overview
  }, { where: { user_id } })

  // Add User skills
  await addUserSkills({ user_id, skillIds })
  return agentResourceDef
}

export async function addUserSkills ({ user_id, skillIds }) {
  // Add skills to user skills
  const skillEntities = skillIds.map(skillId => {
    return ({
      user_id,
      skill_id: skillId
    })
  })
  await XQodUserSkill.bulkCreate(skillEntities)
}

export async function getUserSkills ({ user_id, candidate_id }) {
  let userSkills = await XQodUserSkill.findAll({
    include: [
      {
        model: XQodSkill,
        as: 'skill'
      }
    ],
    where: {
      user_id: candidate_id,
      is_deleted: false
    },
    order: [['user_skill_id', 'ASC']]
  })

  userSkills = userSkills.map(user => user.get({ plain: true }))

  let endorsementsPromiseArray = []

  userSkills.map((userSkill) => {
    endorsementsPromiseArray = [
      ...endorsementsPromiseArray,
      () => XUserActivity.findAll({
        attributes: ['user_id', 'activity_value', 'record_id'],
        where: {
          record_id: userSkill.user_skill_id,
          activity_type: 'endorsement'
        },
        include: [
          {
            model: UserDetail,
            attributes: ['first_name', 'last_name', 'profile_image', 'rating', 'work_title'],
            as: 'userData'
          }
        ]
      })
    ]
  })

  const result = await Promise.all(endorsementsPromiseArray.map(promise => promise()))

  const userSkillIds = result.map((item) => item.length ? item[0].record_id : '')

  const skills = userSkills.map(userSkill => {
    const { skill } = userSkill
    const checkIndex = userSkillIds.indexOf(userSkill.user_skill_id)
    return ({
      skillId: skill.skill_id,
      skillName: skill.skill_name,
      endorsedCount: userSkill.endorsed,
      endorsements: checkIndex === -1 ? [] : result[checkIndex].map(user => {
        return {
          id: user.user_id,
          comment: user.activity_value,
          userProfile: {
            name: user.userData.first_name + ' ' + user.userData.last_name,
            profilePic: user.userData.profile_image
          },
          rating: user.userData.rating,
          workTitle: user.userData.work_title
        }
      })
    })
  })

  const candidateSkills = {
    candidateId: parseInt(candidate_id),
    skills,
    canEndorse: parseInt(candidate_id) !== user_id
    // WIP only endorse when both agent are in same company
  }

  return candidateSkills
}

export async function updateUserSkills ({ user_id, candidate_id, updatedData: updatedSkills }) {
  let userSkills = await XQodUserSkill.findAll({
    attributes: ['skill_id'],
    where: { user_id: candidate_id }
  })

  userSkills = userSkills.map(item => item.get({ plain: true }))

  let promiseArray = []

  if (!userSkills.length) {
    const bulkDataToBeAdded = updatedSkills.map(item => {
      return {
        user_id: candidate_id,
        skill_id: item
      }
    })

    promiseArray = [() => XQodUserSkill.bulkCreate(bulkDataToBeAdded)]
  } else {
    const currentSkills = userSkills.map(item => item.skill_id)

    const skillsAlreadyAdded = _.intersection(currentSkills, updatedSkills)

    const skillsToBeAdded = _.difference(updatedSkills, currentSkills)

    const skillsToBeRemoved = _.difference(currentSkills, updatedSkills)

    if (skillsAlreadyAdded && skillsAlreadyAdded.length) {
      promiseArray = [
        ...promiseArray,
        () => XQodUserSkill.update({
          is_deleted: false
        }, {
          where: {
            user_id: candidate_id,
            skill_id: skillsAlreadyAdded
          }
        })
      ]
    }

    if (skillsToBeAdded && skillsToBeAdded.length) {
      const bulkDataToBeAdded = skillsToBeAdded.map(item => {
        return {
          user_id: candidate_id,
          skill_id: item
        }
      })

      promiseArray = [
        ...promiseArray,
        () => XQodUserSkill.bulkCreate(bulkDataToBeAdded)
      ]
    }

    if (skillsToBeRemoved && skillsToBeRemoved.length) {
      promiseArray = [
        ...promiseArray,
        () => XQodUserSkill.update({
          is_deleted: true
        }, {
          where: {
            user_id: candidate_id,
            skill_id: skillsToBeRemoved
          }
        })
      ]
    }
  }

  await Promise.all(promiseArray.map(promise => promise()))

  const candidateSkills = await getUserSkills({ user_id, candidate_id })

  return candidateSkills
}

export async function addUserEndorsement ({ user_id, candidate_id, updatedData }) {
  const { skillId, comment } = updatedData
  const promises = [
    () => XQodUserSkill.findOne({
      attributes: ['user_skill_id'],
      raw: true,
      where: {
        user_id: candidate_id,
        skill_id: skillId
      }
    }),
    () => XQodUserSkill.increment(
      'endorsed', {
        where: {
          user_id: candidate_id,
          skill_id: skillId
        }
      })
  ]

  let [userSkillId] = await Promise.all(promises.map(promise => promise()))

  if (userSkillId) {
    userSkillId = userSkillId.user_skill_id

    await XUserActivity.create({
      user_id,
      record_type: 'activity',
      record_id: userSkillId,
      activity_type: 'endorsement',
      activity_value: comment
    })

    const candidateSkills = await getUserSkills({ user_id, candidate_id })

    return candidateSkills
  }
}

export async function removeUserEndorsement ({ user_id, candidate_id, updatedData }) {
  const { skillId } = updatedData
  const promises = [
    () => XQodUserSkill.findOne({
      attributes: ['user_skill_id'],
      raw: true,
      where: {
        user_id: candidate_id,
        skill_id: skillId
      }
    }),
    () => XQodUserSkill.decrement(
      'endorsed', {
        where: {
          user_id: candidate_id,
          skill_id: skillId
        }
      })
  ]

  let [userSkillId] = await Promise.all(promises.map(promise => promise()))

  if (userSkillId) {
    userSkillId = userSkillId.user_skill_id

    await XUserActivity.destroy({
      where: {
        user_id,
        record_id: userSkillId
      }
    })

    const candidateSkills = await getUserSkills({ user_id, candidate_id })

    return candidateSkills
  }
}

export async function addJobSkills (skillNames) {
  const skillEntities = skillNames.map(skillName => {
    return ({
      skill_name: skillName
    })
  })
  await XQodSkill.bulkCreate(skillEntities)
}

export async function getAgentResourceDef ({ agent_resource_id }) {
  const agentResourceDef = await getOne({
    model: XQodResourceDef,
    data: {
      resource_def_id: agent_resource_id
    }
  })
  return agentResourceDef
}

export async function getAgentJobProfiles ({
  requiredLanguages = [],
  requiredHourlyRate,
  requiredRating,
  requiredAvailability,
  requiredTalentType,
  searchKeyword
}) {
  let resourceDefQuery = {}
  let userDetailQuery = {}

  if (searchKeyword) {
    userDetailQuery = {
      ...userDetailQuery,
      work_title: {
        [Op.startsWith]: searchKeyword
      }

    }
  }

  // Language filter
  if (requiredLanguages.length > 0) {
    resourceDefQuery = { ...resourceDefQuery, desired_languages: requiredLanguages }
  }
  if (requiredTalentType && requiredTalentType.employmentType) {
    resourceDefQuery = {
      ...resourceDefQuery,
      desired_employment_type: requiredTalentType.employmentType
    }
  }
  // Hourly rate filter
  if (requiredHourlyRate) {
    const { lessThanEq, greaterThanEq } = requiredHourlyRate
    if (lessThanEq && !greaterThanEq) {
      resourceDefQuery = {
        ...resourceDefQuery,
        desired_min_pay: {
          [Op.lte]: lessThanEq
        }
      }
    } else if (greaterThanEq && !lessThanEq) {
      resourceDefQuery = {
        ...resourceDefQuery,
        desired_min_pay: {
          [Op.gte]: greaterThanEq
        }
      }
    } else if (greaterThanEq && lessThanEq) {
      resourceDefQuery = {
        ...resourceDefQuery,
        desired_min_pay: {
          [Op.and]: [
            { [Op.lte]: lessThanEq },
            { [Op.gte]: greaterThanEq }
          ]
        }
      }
    }
  }
  // Availability Filter
  if (requiredAvailability && requiredAvailability.status) {
    resourceDefQuery = {
      ...resourceDefQuery,
      status: requiredAvailability.status
    }
  }

  // Rating Filter
  if (requiredRating) {
    const { greaterThanEq } = requiredRating
    if (greaterThanEq) {
      userDetailQuery = {
        ...userDetailQuery,
        rating: {
          [Op.gte]: greaterThanEq
        }
      }
    }
  }

  // Profile Visibility
  resourceDefQuery = {
    ...resourceDefQuery,
    is_visible: true
  }

  const agentJobProfiles = await XQodResourceDef.findAll({
    include: [
      {
        model: UserDetail,
        attributes: [
          'user_id',
          'first_name',
          'last_name',
          'city',
          'rating',
          'state',
          'primary_language',
          'work_title',
          'work_overview',
          'profile_image'
        ],
        where: userDetailQuery,
        include: [
          {
            model: XQodUserSkill,
            attributes: ['skill_id', 'endorsed'],
            as: 'userSkills',
            where: { is_deleted: false },
            required: false,
            include: [
              {
                model: XQodSkill,
                attributes: ['skill_name'],
                as: 'skill'
              }
            ]
          }
        ]
      }
    ],
    attributes: [
      'resource_def_id',
      'status',
      'avg_peer_rating',
      'desired_min_pay',
      'desired_languages'
    ],
    where: resourceDefQuery
  })
  return agentJobProfiles.map(profile => profile.get({ plain: true }))
}

export async function getAgentResume ({ candidateId }) {
  const agentResume = await XQodResourceDef.findOne({
    include: [
      {
        model: UserDetail,
        attributes: [
          'user_id',
          'first_name',
          'last_name',
          'city',
          'state',
          'rating',
          'primary_language',
          'other_languages',
          'highest_education',
          'years_of_experience',
          'work_title',
          'work_overview',
          'profile_image'
        ],
        include: [
          {
            model: XQodUserSkill,
            attributes: ['skill_id', 'endorsed'],
            as: 'userSkills',
            include: [
              {
                model: XQodSkill,
                attributes: ['skill_name'],
                as: 'skill'
              }
            ]
          }
        ]
      }
    ],
    where: {
      user_id: candidateId
    }
  })

  if (agentResume) {
    return agentResume.get({ plain: true })
  }

  const userDetailsResult = await UserDetail.findOne({
    attributes: [
      'user_id',
      'first_name',
      'last_name',
      'city',
      'state',
      'primary_language',
      'other_languages',
      'highest_education',
      'years_of_experience',
      'work_title',
      'work_overview',
      'profile_image'
    ],
    include: [
      {
        model: XQodUserSkill,
        attributes: ['skill_id', 'endorsed'],
        as: 'userSkills',
        include: [
          {
            model: XQodSkill,
            attributes: ['skill_name'],
            as: 'skill'
          }
        ]
      }
    ],
    where: {
      user_id: candidateId
    }
  })

  if (userDetailsResult) {
    const UserDetail = userDetailsResult.get({ plain: true })
    return { UserDetail }
  }
}

export async function postAgentApplication ({
  user_id,
  client_id,
  job_id,
  cover_letter,
  video_pitch_url,
  status,
  status_reason,
  start_date,
  end_date
}) {
  const application = await createNewEntity({
    model: XQodApplication,
    data: {
      user_id,
      client_id,
      job_id,
      cover_letter,
      video_pitch_url,
      status,
      status_reason,
      start_date,
      end_date
    }
  })
  return application
}

export const getTopTalent = async () => {
  const topTalent = await XQodResourceDef.findAll({
    where: {
      is_visible: true
    },
    attributes: [],
    include: [
      {
        model: UserDetail,
        attributes: [
          'user_id', 'work_title', 'rating', 'profile_image'
        ],
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['full_name'],
            where: { user_code: 'agent' }
          }
        ]
      }
    ],
    limit: 10,
    order: [
      [Sequelize.col('UserDetail.rating'), 'DESC']
    ]
  })
  return topTalent.map(talent => talent.get({ plain: true }))
}

const formatUnitInfo = ({ units }) => {
  return units.map((unit, index) => {
    return {
      unit_num: unit.unitNum,
      title: unit.title,
      details: unit.details,
      length: unit.length,
      type: unit.type,
      order: index + 1
    }
  })
}

const formatQuestionInfo = ({ questions }) => {
  return questions.map((question, index) => {
    return {
      question_type: question.questionType,
      question: question.questionText,
      answer: question.answerText,
      option1: ['multiple', 'checkbox'].includes(question.questionType) && question.options && question.options.length > 0
        ? question.options[0].value
        : (_.isEqual(question.questionType, 'scale') && question.scale && question.scale.minRange
          ? question.scale.minRange
          : null),
      option2: ['multiple', 'checkbox'].includes(question.questionType) && question.options && question.options.length > 1
        ? question.options[1].value
        : (_.isEqual(question.questionType, 'scale') && question.scale && question.scale.maxRange
          ? question.scale.maxRange
          : null),
      option3: ['multiple', 'checkbox'].includes(question.questionType) && question.options && question.options.length > 2
        ? question.options[2].value
        : null,
      option4: ['multiple', 'checkbox'].includes(question.questionType) && question.options && question.options.length > 3
        ? question.options[3].value
        : null,
      option5: ['multiple', 'checkbox'].includes(question.questionType) && question.options && question.options.length > 4
        ? question.options[4].value
        : null,
      order: index + 1
    }
  })
}

const formatSectionInfo = ({ sections }) => {
  return sections.map((section, index) => {
    return {
      section_num: section.sectionNum,
      title: section.title,
      is_active: section.sectionIsActive,
      order: index + 1,
      units: formatUnitInfo({ units: section.units }),
      questions: section.test && section.test.questions
        ? formatQuestionInfo({ questions: section.test.questions })
        : []
    }
  })
}

const formatCourseInfo = ({ course }) => {
  return {
    category_id: course.informationSection.category,
    creator_id: course.informationSection.creatorId,
    title: course.informationSection.title,
    description: course.informationSection.description,
    goals: course.informationSection.goals,
    requirements: course.informationSection.requirements,
    outcomes: course.informationSection.outcomes,
    image_url: course.image_url,
    video_url: course.video_url,
    token_price: course.informationSection.price,
    visibility: course.informationSection.visibility,
    status: course.status,
    language: course.informationSection.language,
    sections: course.courseContent.sections
      ? formatSectionInfo({ sections: course.courseContent.sections })
      : [],
    createdAt: Date.now()
  }
}

export async function addNewCourse ({ course }) {
  const addedCourse = await XQodCourse.create(
    formatCourseInfo({ course }), {
      include: [
        {
          model: XQodCourseSection,
          as: 'sections',
          include: [
            {
              model: XQodCourseUnit,
              as: 'units'
            },
            {
              model: XQodCourseSectionQA,
              as: 'questions'
            }
          ]
        }
      ]
    }
  )

  return addedCourse
}

export async function updateCourse ({ course }) {
  const courseInfo = formatCourseInfo({ course })
  const sectionInfo = courseInfo['sections'].map((section) => {
    return {
      ...section,
      course_id: course.courseId
    }
  })

  await XQodCourseSection.destroy({
    where: { course_id: course.courseId }
  })

  const promiseArray = [
    () => XQodCourse.update(
      courseInfo,
      { where: { course_id: course.courseId } }),
    () => XQodCourseSection.bulkCreate(sectionInfo, {
      include: [
        {
          model: XQodCourseUnit,
          as: 'units'
        },
        {
          model: XQodCourseSectionQA,
          as: 'questions'
        }
      ]
    })
  ]

  await Promise.all(promiseArray.map(promise => promise()))
}

export async function getCourseById ({ course_id, user_id }) {
  let course = await XQodCourse.findAll({
    include: [
      {
        model: XQodCourseSection,
        as: 'sections',
        required: false,
        include: [
          {
            model: XQodCourseUnit,
            as: 'units'
          },
          {
            model: XQodCourseSectionQA,
            as: 'questions'
          }
        ]
      }
    ],
    where: {
      course_id,
      creator_id: user_id
    },
    order: [
      [{ model: XQodCourseSection, as: 'sections' }, 'order', 'ASC'],
      [{ model: XQodCourseSection, as: 'sections' }, { model: XQodCourseUnit, as: 'units' }, 'order', 'ASC'],
      [{ model: XQodCourseSection, as: 'sections' }, { model: XQodCourseSectionQA, as: 'questions' }, 'order', 'ASC']
    ]
  })

  if (course && course.length) {
    course = course.map(item => item.get({ plain: true }))
    return course[0]
  }
}

export const deleteCourseById = async ({ course_id, user_id }) => {
  const isDeleted = await XQodCourse.destroy({
    where: {
      course_id,
      creator_id: user_id,
      status: 'draft'
    }
  })

  return isDeleted
}

export const getRequiredCoursesById = async ({ course_id }) => {
  const requiredCourses = await XQodCoursePrereqs.findAll({
    raw: true,
    attributes: ['prereq_course_id'],
    where: {
      course_id
    }
  })

  return requiredCourses
}

export const getRequiredCoursesData = async ({ requiredCourses, user_id }) => {
  const requiredCoursesData = await XQodCourse.findAll({
    attributes: ['course_id', 'title', 'createdAt', 'image_url'],
    include: [
      {
        model: UserDetail,
        as: 'creatorDetails',
        attributes: [
          ['first_name', 'firstName'],
          ['last_name', 'lastName']
        ]
      },
      {
        model: XQodUserCourse,
        as: 'students',
        attributes: ['status'],
        required: false,
        where: {
          user_id
        }
      }
    ],
    where: {
      course_id: requiredCourses.map((course) => course.prereq_course_id)
    }
  })

  return requiredCoursesData && requiredCoursesData.map(item => item.get({ plain: true }))
}

export const deleteRequiredCourses = async ({ course_id }) => {
  await XQodCoursePrereqs.destroy({
    where: {
      course_id
    }
  })
}

export const addRequiredCourses = async ({ course_id, requiredCourses }) => {
  const bulkDataToBeAdded = requiredCourses.map((prereq_course_id) => {
    return {
      course_id,
      prereq_course_id
    }
  })

  await XQodCoursePrereqs.bulkCreate(bulkDataToBeAdded)
}

export const findStudentsEnrolledCount = async ({ course_id }) => {
  const studentsEnrolled = await XQodUserCourse.count({
    where: {
      course_id
    }
  })

  return studentsEnrolled
}

export async function getCategoryTitleById ({ category_id }) {
  const categoryTitle = await XQodCategory.findOne({
    raw: true,
    attributes: ['category_name'],
    where: {
      category_id
    }
  })

  return categoryTitle && categoryTitle.category_name
}

export async function getAllCourseInfo ({ creatorId }) {
  let courses = await XQodCourse.findAll({
    attributes: [
      'course_id',
      'token_price',
      'rating',
      'title',
      'image_url',
      'language',
      'status',
      [Sequelize.literal('COUNT(DISTINCT(`sections`.`section_id`))'), 'sectionsCount'],
      [Sequelize.literal('COUNT(DISTINCT(`students`.`user_id`))'), 'studentsCount'],
      [Sequelize.literal('COUNT(DISTINCT(CASE WHEN `userTest`.`verified` = false ' +
        'THEN `userTest`.`user_id` END))'), 'testEntries'],
      [Sequelize.literal('COUNT(DISTINCT(CASE WHEN MONTH(`students`.`created_on`) = MONTH(CURRENT_DATE())' +
      'AND YEAR(`students`.`created_on`) = YEAR(CURRENT_DATE()) THEN `students`.`user_id` END))'), 'enrolledThisMonth']
    ],
    group: ['XQodCourse.course_id'],
    subquery: false,
    required: false,
    include: [
      {
        model: XQodCourseSection,
        as: 'sections',
        attributes: []
      },
      {
        model: XQodUserCourse,
        as: 'students',
        attributes: []
      },
      {
        model: XQodCourseUserQA,
        as: 'userTest',
        attributes: []
      }
    ],
    where: { creator_id: creatorId }
  })

  if (courses && courses.length) {
    courses = courses.map(item => item.get({ plain: true }))
  }
  return courses
}

export const getTotalRaters = async ({ courseIds }) => {
  const totalRaters = await XUserActivity.findAll({
    attributes: [
      ['record_id', 'course_id'],
      [Sequelize.literal('COUNT(DISTINCT(`user_id`))'), 'totalAverageRaters']
    ],
    group: ['record_id'],
    where: {
      record_id: courseIds,
      record_type: 'course'
    }
  })

  if (totalRaters && totalRaters.length) {
    return totalRaters.map(item => item.get({ plain: true }))
  }
}

export const formatViewUnitData = ({ units, unitsStatus, isCreator }) => {
  return units.map((unit) => {
    const isUnitPresent = unitsStatus && unitsStatus.length &&
    unitsStatus.find((item) => item.unit_id === unit.unit_id)

    return {
      unitId: unit.unit_id,
      unitNum: unit.unit_num,
      title: unit.title,
      length: unit.length,
      details: isCreator ? unit.details : '',
      type: unit.type,
      status: isUnitPresent ? isUnitPresent.status : ''
    }
  })
}

export const formatViewSectionData = ({ sections, sectionsCompleted, unitsStatus, isCreator, userTestEntries }) => {
  return sections.map((section) => {
    const units = formatViewUnitData({ units: section.units, unitsStatus, isCreator })

    const isSectionCompleted = sectionsCompleted && sectionsCompleted.length &&
    sectionsCompleted.find((item) => item.section_id === section.section_id)

    const isSectionInProgress = !isSectionCompleted && units.find((unit) => unit.status === 'inprogress')

    return {
      id: section.section_id,
      title: section.title,
      sectionNum: section.section_num,
      units,
      status: isSectionCompleted
        ? 'completed'
        : (isSectionInProgress ? 'inprogress' : ''),
      isTestCompleted: userTestEntries && !!userTestEntries.find((section_id) => section_id === section.section_id)
    }
  })
}

export const formatViewRequiredCoursesData = ({ requiredCourses }) => {
  return requiredCourses.map((course) => {
    return {
      courseId: course.course_id,
      courseTitle: course.title,
      courseImage: course.image_url,
      creatorName: course.creatorDetails && course.creatorDetails.firstName + ' ' + course.creatorDetails.lastName,
      createdAt: formatDate(course.createdAt),
      status: course.students && course.students.length
        ? course.students[0].status
        : 'unenrolled'
    }
  })
}

export const formatViewCourseData = ({
  course,
  isEnrolled,
  isCreator,
  sectionsCompleted,
  unitsStatus,
  studentsEnrolled,
  categoryTitle,
  courseDetails,
  creatorDetails,
  totalRaters,
  requiredCourses,
  userTestEntries,
  isCourseTakenInJob
}) => {
  return {
    isEnrolled,
    isCreator,
    courseId: course.course_id,
    createdOn: course.createdAt,
    updatedOn: course.updatedAt,
    sectionsCompleted: sectionsCompleted && sectionsCompleted.length,
    studentsEnrolled,
    rating: course.rating,
    totalRaters,
    canEdit: isCreator && studentsEnrolled === 0 && !isCourseTakenInJob,
    informationSection: {
      creatorId: course.creator_id,
      creatorName: creatorDetails.full_name,
      title: course.title,
      category: course.category_id,
      categoryTitle: categoryTitle,
      price: course.token_price,
      visibility: course.visibility,
      description: course.description,
      goals: course.goals,
      outcomes: course.outcomes,
      requirements: course.requirements,
      language: course.language,
      requiredCourses: requiredCourses
        ? formatViewRequiredCoursesData({ requiredCourses })
        : []
    },
    contentSection: {
      thumbnailImage: course.image_url,
      introductionVideo: course.video_url
    },
    courseContent: {
      sections: formatViewSectionData({
        sections: course.sections, sectionsCompleted, unitsStatus, isCreator, userTestEntries
      })
    },
    courseDetails
  }
}

export async function getViewCourseById ({ course_id, user_id }) {
  const promiseArray = [
    () => XQodUserCourse.findOne({
      raw: true,
      where: {
        course_id,
        user_id
      }
    }),
    () => XQodCourse.findOne({
      include: [
        {
          model: XQodCourseSection,
          as: 'sections',
          required: false,
          include: [
            {
              model: XQodCourseUnit,
              as: 'units',
              attributes: { exclude: ['details'] }
            }
          ]
        }
      ],
      where: {
        course_id,
        status: 'published'
      },
      order: [
        [{ model: XQodCourseSection, as: 'sections' }, 'order', 'ASC'],
        [{ model: XQodCourseSection, as: 'sections' }, { model: XQodCourseUnit, as: 'units' }, 'order', 'ASC']
      ]
    }),
    () => XQodUserCourse.count({
      raw: true,
      where: {
        course_id
      }
    }),
    () => XUserActivity.findAll({
      raw: true,
      attributes: [
        [Sequelize.literal('COUNT(DISTINCT(`user_id`))'), 'totalAverageRaters']
      ],
      where: {
        record_id: course_id,
        record_type: 'course'
      }
    }),
    () => XQodCoursePrereqs.findAll({
      raw: true,
      attributes: ['prereq_course_id'],
      where: {
        course_id
      }
    }),
    () => XQodCourseUserQA.findAll({
      raw: true,
      attributes: ['section_id'],
      where: {
        user_id,
        course_id,
        test_type: 'section_wise'
      },
      group: ['XQodCourseUserQA.section_id']
    })
  ]

  let [
    userCourse,
    course,
    studentsEnrolled,
    totalRaters,
    requiredCourses,
    userTestEntries
  ] = await Promise.all(promiseArray.map(promise => promise()))

  if (course) {
    course = course.get({ plain: true })

    let isEnrolled = false
    let newPromiseArray = []
    let courseDetails = {}
    let requiredCoursesData = []
    const categoryTitle = await getCategoryTitleById({ category_id: course.category_id })
    const creatorDetails = await User.findOne({
      attributes: ['full_name'],
      where: { user_id: course.creator_id }
    })

    if (userCourse) {
      isEnrolled = true
      courseDetails = {
        ...courseDetails,
        dateStarted: userCourse.date_started,
        dateCompleted: userCourse.date_completed,
        status: userCourse.status,
        grade: userCourse.grade,
        certificate: userCourse.certificate_nft_id,
        endorsed: userCourse.endorsed
      }
      newPromiseArray = [
        ...newPromiseArray,
        () => XQodCourseUnitsUser.findAll({
          raw: true,
          attributes: ['unit_id', 'status'],
          where: {
            course_id,
            user_id
          }
        }),
        () => XQodCourseUserQA.findAll({
          attributes: ['section_id'],
          raw: true,
          group: ['section_id'],
          where: {
            user_id,
            course_id
          }
        })
      ]
    }

    if (requiredCourses && requiredCourses.length) {
      requiredCoursesData = await getRequiredCoursesData({ requiredCourses, user_id })
    }

    const [unitsStatus, sectionsCompleted] = await Promise.all(newPromiseArray.map(promise => promise()))

    const formattedViewCourse = formatViewCourseData({
      course,
      isEnrolled,
      sectionsCompleted,
      unitsStatus,
      studentsEnrolled,
      categoryTitle,
      courseDetails,
      creatorDetails,
      totalRaters: totalRaters && totalRaters.length && totalRaters[0].totalAverageRaters,
      isCreator: false,
      requiredCourses: requiredCoursesData,
      userTestEntries: userTestEntries && userTestEntries.map((item) => item.section_id)
    })

    if (formattedViewCourse.informationSection.requiredCourses) {
      formattedViewCourse.canBuy = _.isUndefined(formattedViewCourse.informationSection.requiredCourses
        .find((requiredCourse) => requiredCourse.status !== 'completed'))
    } else {
      formattedViewCourse.canBuy = true
    }

    return formattedViewCourse
  }
}

export const checkIsCourseCreator = async ({ course_id, user_id }) => {
  const isCreator = await XQodCourse.findOne({
    raw: true,
    attributes: ['title'],
    where: {
      course_id,
      creator_id: user_id
    }
  })

  return isCreator
}

export const getCourseUsageInJob = async ({ course_id }) => {
  const isCourseTakenInJob = await XQodJobCourse.findOne({
    raw: true,
    attributes: ['job_id'],
    where: { course_id }
  })

  return isCourseTakenInJob
}

export const getCreatorViewCourseById = async ({ course_id, user_id }) => {
  let promiseArray = [
    () => User.findOne({
      attributes: ['full_name'],
      where: { user_id }
    }),
    () => XQodCourse.findAll({
      include: [
        {
          model: XQodCourseSection,
          as: 'sections',
          required: false,
          include: [
            {
              model: XQodCourseUnit,
              as: 'units'
            }
          ]
        }
      ],
      where: {
        course_id,
        status: 'published'
      },
      order: [
        [{ model: XQodCourseSection, as: 'sections' }, 'order', 'ASC'],
        [{ model: XQodCourseSection, as: 'sections' }, { model: XQodCourseUnit, as: 'units' }, 'order', 'ASC']
      ]
    }),
    () => XQodUserCourse.count({
      raw: true,
      where: {
        course_id
      }
    }),
    () => XUserActivity.findAll({
      raw: true,
      attributes: [
        [Sequelize.literal('COUNT(DISTINCT(`user_id`))'), 'totalAverageRaters']
      ],
      where: {
        record_id: course_id,
        record_type: 'course'
      }
    })
  ]

  let [creatorDetails, course, studentsEnrolled, totalRaters] = await Promise.all(promiseArray.map(promise => promise()))

  if (course && course.length) {
    course = course.map(item => item.get({ plain: true }))[0]

    promiseArray = [
      () => getCategoryTitleById({ category_id: course.category_id }),
      () => getRequiredCoursesById({ course_id }),
      () => getCourseUsageInJob({ course_id })
    ]

    const [categoryTitle, requiredCourses, isCourseTakenInJob] = await Promise.all(promiseArray.map(promise => promise()))

    let requiredCoursesData = []

    if (requiredCourses && requiredCourses.length) {
      requiredCoursesData = await getRequiredCoursesData({ requiredCourses, user_id })
    }

    const formattedViewCourse = formatViewCourseData({
      course,
      isEnrolled: false,
      isCreator: true,
      sectionsCompleted: [],
      unitsStatus: [],
      studentsEnrolled,
      categoryTitle,
      courseDetails: {},
      creatorDetails,
      totalRaters: totalRaters && totalRaters.length && totalRaters[0].totalAverageRaters,
      requiredCourses: requiredCoursesData,
      isCourseTakenInJob
    })

    return formattedViewCourse
  }
}

export const formatScaleData = ({ question }) => {
  return {
    minRange: question.option1,
    maxRange: question.option2
  }
}

export const formatOptionsData = ({ question }) => {
  let optionsArray = []

  const optionsData = ({ value }) => {
    return {
      id: generateRandomUniqueIdString(),
      value
    }
  }

  if (question.option1) {
    optionsArray = [
      ...optionsArray,
      optionsData({ value: question.option1 })
    ]
  }

  if (question.option2) {
    optionsArray = [
      ...optionsArray,
      optionsData({ value: question.option2 })
    ]
  }

  if (question.option3) {
    optionsArray = [
      ...optionsArray,
      optionsData({ value: question.option3 })
    ]
  }

  if (question.option4) {
    optionsArray = [
      ...optionsArray,
      optionsData({ value: question.option4 })
    ]
  }

  if (question.option5) {
    optionsArray = [
      ...optionsArray,
      optionsData({ value: question.option5 })
    ]
  }

  return optionsArray
}

export const formatQuestionData = ({ questions }) => {
  return questions.map((question) => {
    let options = [
      { id: generateRandomUniqueIdString(), value: '' },
      { id: generateRandomUniqueIdString(), value: '' }
    ]

    if (['multiple', 'checkbox'].includes(question.question_type)) {
      options = formatOptionsData({ question })
    }

    const correctOption = _.isEqual(question.question_type, 'multiple')
      ? options.find((option) => option.value === question.answer).id
      : ''

    const correctOptions = _.isEqual(question.question_type, 'checkbox')
      ? options.filter((option) => JSON.parse(question.answer).includes(option.value)).map((option) => option.id)
      : []

    let dateTime = {
      date: '',
      time: '',
      isDate: false,
      isTime: false
    }

    if (_.isEqual(question.question_type, 'date')) {
      dateTime = {
        date: JSON.parse(question.answer).date ? JSON.parse(question.answer).date : '',
        time: JSON.parse(question.answer).time ? JSON.parse(question.answer).time : '',
        isDate: !!JSON.parse(question.answer).date,
        isTime: !!JSON.parse(question.answer).time
      }
    }

    return {
      id: question.section_qa_id,
      questionType: question.question_type,
      questionText: question.question,
      answerText: question.answer,
      options,
      isSaved: true,
      correctOptions,
      correctOption,
      scale: _.isEqual(question.question_type, 'scale')
        ? formatScaleData({ question })
        : {},
      dateTime
    }
  })
}

export const formatUnitData = ({ units }) => {
  return units.map((unit) => {
    return {
      unitId: unit.unit_id,
      unitNum: unit.unit_num,
      title: unit.title,
      details: unit.details,
      length: unit.length,
      type: unit.type,
      isEmpty: false,
      isOpen: false
    }
  })
}

export const formatSectionData = ({ sections }) => {
  return sections.map((section) => {
    return {
      id: section.section_id,
      title: section.title,
      sectionNum: section.section_num,
      sectionIsActive: section.is_active,
      isEdit: false,
      units: formatUnitData({ units: section.units }),
      test: section.questions && section.questions.length
        ? {
          title: 'Test',
          length: 0,
          questions: formatQuestionData({ questions: section.questions }),
          isEmpty: false,
          isOpen: false
        }
        : {}
    }
  })
}

export const formatCourseData = ({ course, categoryTitle, requiredCourses }) => {
  return {
    courseId: course.course_id,
    createdOn: course.createdAt,
    updatedOn: course.updatedAt,
    status: course.status,
    informationSection: {
      creatorId: course.creator_id,
      title: course.title,
      category: course.category_id,
      categoryTitle,
      price: course.token_price,
      visibility: course.visibility,
      description: course.description,
      goals: course.goals,
      outcomes: course.outcomes,
      requirements: course.requirements,
      language: course.language,
      requiredCourses: requiredCourses
        ? formatViewRequiredCoursesData({ requiredCourses })
        : []
    },
    contentSection: {
      thumbnailImage: course.image_url,
      introductionVideo: course.video_url
    },
    courseContent: {
      sections: formatSectionData({ sections: course.sections })
    }
  }
}

export const formatCourseCard = ({ course, totalRaters }) => {
  const isRatingsCount = totalRaters && totalRaters.find((item) => item.course_id === course.course_id)

  return {
    courseId: course.course_id,
    title: course.title,
    language: course.language,
    price: course.token_price,
    thumbnailImage: course.image_url,
    status: course.status,
    rating: course.rating,
    studentsCount: course.studentsCount,
    sectionsCount: course.sectionsCount,
    testEntries: course.testEntries,
    enrolledThisMonth: course.enrolledThisMonth,
    ratingsCount: _.isUndefined(isRatingsCount) ? 0 : isRatingsCount.totalAverageRaters
    // WIP: totalEarned
  }
}

export async function getAllViewCourses ({ searchField, categoryId, courseFilter, offset, creatorIds }) {
  let query = {
    status: 'published'
  }
  let additionalParams = {
    limit: 15,
    group: ['XQodCourse.course_id'],
    order: [
      ['course_id', 'ASC']
    ]
  }

  if (!_.isEmpty(searchField)) {
    query = {
      ...query,
      [Op.or]: [
        { description: { [Op.substring]: searchField } },
        { title: { [Op.substring]: searchField } }
      ]
    }
  }

  if (!_.isEmpty(categoryId)) {
    query = {
      ...query,
      category_id: categoryId
    }
  }

  if (!_.isEmpty(creatorIds)) {
    query = {
      ...query,
      creator_id: creatorIds
    }
  }

  if (!_.isUndefined(offset)) {
    additionalParams = {
      ...additionalParams,
      offset: parseInt(offset)
    }
  }

  if (!_.isUndefined(courseFilter)) {
    if (_.isEqual(courseFilter, 'mostPopular')) {
      additionalParams = {
        ...additionalParams,
        order: [
          [Sequelize.literal('studentsCount'), 'DESC'],
          ...additionalParams.order
        ]
      }
    } else if (_.isEqual(courseFilter, 'latest')) {
      additionalParams = {
        ...additionalParams,
        order: [
          ['created_on', 'DESC'],
          ...additionalParams.order
        ]
      }
    } else if (_.isEqual(courseFilter, 'bestRating')) {
      additionalParams = {
        ...additionalParams,
        order: [
          ['rating', 'DESC'],
          ...additionalParams.order
        ]
      }
    }
  }

  const { rows, count } = await XQodCourse.findAndCountAll({
    required: false,
    subQuery: false,
    attributes: [
      ['course_id', 'courseId'],
      ['category_id', 'categoryId'],
      ['token_price', 'price'],
      'rating',
      'title',
      ['image_url', 'imageUrl'],
      'language',
      [Sequelize.literal('COUNT(DISTINCT(`students`.`user_id`))'), 'studentsCount'],
      [Sequelize.literal('COUNT(DISTINCT(`sections`.`section_id`))'), 'sectionsCount']
    ],
    include: [
      {
        model: XQodUserCourse,
        as: 'students',
        attributes: []
      },
      {
        model: XQodCourseSection,
        as: 'sections',
        attributes: []
      },
      {
        model: UserDetail,
        as: 'creatorDetails',
        attributes: [
          ['first_name', 'firstName'],
          ['last_name', 'lastName']
        ]
      }
    ],
    where: query,
    ...additionalParams
  })

  if (rows && count) {
    return {
      courses: rows,
      count: count.length
    }
  }
}

export const getOnlyCourseById = async ({ course_id }) => {
  return getOne({
    model: XQodCourse,
    data: { course_id }
  })
}

export const enrollUserToCourse = async ({ user_id, course }) => {
  // TODO: Add buy course transaction to blockchain, SRS page: 66

  const userCourseData = {
    user_id,
    course_id: course.course_id,
    status: 'enrolled'
  }
  const newEnrolledUserCourse = await createNewEntity({
    model: XQodUserCourse,
    data: userCourseData
  })

  return newEnrolledUserCourse
}

export const getUserCourseByCourseId = async ({ course_id, user_id }) => {
  return getOne({
    model: XQodUserCourse,
    data: {
      course_id,
      user_id
    }
  })
}

export const updateUserCourseInfo = async ({ course_id, user_id }) => {
  const date = Date.now()

  const userCourse = await XQodUserCourse.findOne({
    raw: true,
    where: {
      course_id,
      user_id
    }
  })

  let course = null
  let newUserCourse = null

  if (userCourse) {
    course = await XQodUserCourse.update({
      status: 'inprogress',
      date_started: date
    }, {
      where: {
        course_id,
        user_id
      }
    })
  } else {
    newUserCourse = await XQodUserCourse.create({
      user_id,
      course_id,
      date_started: date,
      status: 'inprogress'
    })
  }

  if (userCourse && course && course[0]) {
    return {
      status: 'inprogress',
      dateStarted: formatDate(date)
    }
  } else if (!userCourse && newUserCourse) {
    return {
      status: newUserCourse.status,
      dateStarted: formatDate(newUserCourse.date_started)
    }
  }
}

export const fetchUserUnitDetails = async ({ course_id, user_id, unit_id }) => {
  const userUnitDetails = await XQodCourseUnitsUser.findOne({
    raw: true,
    where: {
      user_id,
      course_id,
      unit_id
    }
  })

  return userUnitDetails
}

export const updateUserUnitStatus = async ({ course_id, user_id, status, unit_id }) => {
  await XQodCourseUnitsUser.update(
    {
      status
    },
    {
      where: {
        user_id,
        course_id,
        unit_id
      }
    }
  )
}

export const updateUserUnitDetails = async ({ course_id, user_id, status, unit_id }) => {
  let isNewEntryCreated = false

  if (_.isEqual(status, 'inprogress')) {
    const userUnitDetails = await fetchUserUnitDetails({ course_id, user_id, unit_id })

    if (!userUnitDetails) {
      isNewEntryCreated = true

      await XQodCourseUnitsUser.create({
        user_id,
        course_id,
        unit_id,
        status
      })
    }
  }

  if (!isNewEntryCreated) {
    await updateUserUnitStatus({ course_id, user_id, status, unit_id })
  }
}

export const fetchUnitDetails = async ({ unit_id, status }) => {
  const unitDetails = await XQodCourseUnit.findOne({
    raw: true,
    where: {
      unit_id
    }
  })

  return unitDetails && {
    unitId: unitDetails.unit_id,
    unitNum: unitDetails.unit_num,
    title: unitDetails.title,
    details: unitDetails.details,
    length: unitDetails.length,
    type: unitDetails.type,
    status
  }
}

export const fetchTestDetails = async ({ section_id }) => {
  const questions = await XQodCourseSectionQA.findAll({
    raw: true,
    where: {
      section_id
    },
    order: [
      ['order', 'ASC']
    ]
  })

  return questions
}

export const formatTestQuestionsData = ({ questions }) => {
  return questions.map((question) => {
    let options = []
    let dateTime = {
      isDate: false,
      isTime: false
    }
    let scale = {}

    if (_.isEqual(question.question_type, 'date')) {
      dateTime = {
        isDate: !!JSON.parse(question.answer).date,
        isTime: !!JSON.parse(question.answer).time
      }
    }

    if (_.isEqual(question.question_type, 'scale')) {
      scale = {
        minRange: question.option1,
        maxRange: question.option2
      }
    }

    if (['multiple', 'checkbox'].includes(question.question_type)) {
      options = formatOptionsData({ question })
    }

    return {
      id: question.section_qa_id,
      questionType: question.question_type,
      questionText: question.question,
      options,
      dateTime,
      scale
    }
  })
}

export const getCorrectAnswers = async ({ sectionIds }) => {
  const correctAnswers = await XQodCourseSectionQA.findAll({
    attributes: ['section_qa_id', 'answer'],
    where: {
      section_id: sectionIds
    }
  })

  return correctAnswers && correctAnswers.map(item => item.get({ plain: true }))
}

export const createUserTestBulkData = ({ user_id, course_id, sectionIds, questions, correctAnswers, testType }) => {
  return questions.map((question) => {
    return {
      user_id,
      course_id,
      section_id: sectionIds && sectionIds.length && _.isEqual(testType, 'section_wise')
        ? sectionIds[0]
        : question.sectionId,
      section_qa_id: question.id,
      answer: question.answer,
      correct: ['multiple', 'checkbox', 'scale', 'date'].includes(question.questionType)
        ? _.isEqual(correctAnswers.find((item) => item.section_qa_id === question.id).answer, question.answer)
        : null,
      verified: ['multiple', 'checkbox', 'scale', 'date'].includes(question.questionType),
      test_type: testType
    }
  })
}

export const addTestEntries = async ({ user_id, course_id, sectionIds, questions, testType }) => {
  const correctAnswers = await getCorrectAnswers({ sectionIds })

  if (correctAnswers && correctAnswers.length) {
    const bulkDataToBeAdded = createUserTestBulkData({
      user_id, course_id, sectionIds, questions, correctAnswers, testType
    })

    await XQodCourseUserQA.bulkCreate(bulkDataToBeAdded)
  }
}

export const updateCourseStatus = async ({ user_id, course_id }) => {
  await XQodUserCourse.update({
    status: 'completed',
    date_completed: Date.now()
  }, {
    where: {
      user_id,
      course_id
    }
  })
}

export const getRandomQuestions = ({ questions }) => {
  const randomQuestions = questions.map((item) => {
    return {
      ...item,
      questions: formatTestQuestionsData({
        questions: _.shuffle(item.questions)
          .slice(0,
            Math.max(Math.floor(Math.random() * item.questions.length) + 1, Math.floor(item.questions.length * 0.25)))
      })
    }
  })

  return randomQuestions
}

export const fetchAssessmentTestDetails = async ({ course_id }) => {
  const questions = await XQodCourseSection.findAll({
    attributes: [
      ['section_id', 'sectionId'],
      'title'
    ],
    include: [
      {
        model: XQodCourseSectionQA,
        as: 'questions'
      }
    ],
    where: {
      course_id
    }
  })

  return questions && questions.map(item => item.get({ plain: true }))
}

export const fetchAllTestEntries = async ({ course_id, user_id }) => {
  const promiseArray = [
    () => XQodCourse.findOne({
      raw: true,
      attributes: ['title'],
      where: {
        course_id,
        creator_id: user_id
      }
    }),
    () => XQodCourseUserQA.findAll({
      attributes: ['user_id', 'test_type'],
      include: [
        {
          model: UserDetail,
          as: 'userDetails',
          attributes: ['first_name', 'last_name', 'profile_image']
        }
      ],
      where: {
        course_id,
        verified: false
      },
      group: ['user_id', 'test_type']
    })
  ]

  const [courseTitle, testEntries] = await Promise.all(promiseArray.map(promise => promise()))

  if (courseTitle && courseTitle.title && testEntries) {
    return {
      courseTitle: courseTitle.title,
      testEntries: testEntries.map(item => item.get({ plain: true }))
    }
  }
}

export const formatTestEntriesData = ({ course_id, testEntriesData }) => {
  return {
    courseId: course_id,
    courseTitle: testEntriesData.courseTitle,
    testEntries: testEntriesData.testEntries && testEntriesData.testEntries.map((item) => {
      return {
        candidateId: item.user_id,
        candidateName: item.userDetails && item.userDetails.first_name && item.userDetails.last_name &&
          item.userDetails.first_name + ' ' + item.userDetails.last_name,
        candidatePic: item.userDetails && item.userDetails.profile_image,
        testType: item.test_type
      }
    })
  }
}

export const checkAuthenticUser = async ({ user_id, course_id }) => {
  const isAuthenticUser = await XQodCourse.findOne({
    raw: true,
    attributes: ['category_id'],
    where: {
      course_id,
      creator_id: user_id
    }
  })

  return isAuthenticUser
}

export const fetchTestEntry = async ({ course_id, user_id, test_type }) => {
  const testEntry = await XQodCourseUserQA.findAll({
    attributes: ['section_id', 'user_qa_id', 'answer'],
    include: [
      {
        model: XQodCourseSection,
        as: 'sectionDetails',
        attributes: ['title', 'order']
      },
      {
        model: XQodCourseSectionQA,
        as: 'questionDetails',
        attributes: ['question', 'question_type', 'answer']
      }
    ],
    where: {
      course_id,
      user_id,
      test_type,
      verified: false
    }
  })

  return testEntry && testEntry.map(entry => entry.get({ plain: true }))
}

export const formatTestEntryData = ({ testEntry }) => {
  const sectionIds = _.uniq(_.map(testEntry, 'section_id'))

  return sectionIds.map((section_id) => {
    const sectionData = testEntry.find((item) => item.section_id === section_id)
    const questionsData = testEntry.filter((item) => item.section_id === section_id)

    return {
      sectionId: section_id,
      sectionTitle: sectionData && sectionData.sectionDetails && sectionData.sectionDetails.title,
      sectionNum: sectionData && sectionData.sectionDetails && sectionData.sectionDetails.order,
      questions: questionsData && formatTestEntryQuestionsData({ questionsData })
    }
  })
}

export const formatTestEntryQuestionsData = ({ questionsData }) => {
  return questionsData.map((item) => {
    return {
      questionId: item.user_qa_id,
      candidateAnswer: item.answer,
      questionText: item.questionDetails && item.questionDetails.question,
      questionType: item.questionDetails && item.questionDetails.question_type,
      correctAnswer: item.questionDetails && item.questionDetails.answer
    }
  })
}

export const updateTestEntry = async ({ validatedData }) => {
  const correctAnswerIds = validatedData.filter((item) => item.correct).map((item) => item.questionId)
  const wrongAnswerIds = validatedData.filter((item) => !item.correct).map((item) => item.questionId)

  if (correctAnswerIds && correctAnswerIds.length) {
    await XQodCourseUserQA.update(
      {
        verified: true,
        correct: true
      },
      {
        where: {
          user_qa_id: correctAnswerIds
        }
      }
    )
  }

  if (wrongAnswerIds && wrongAnswerIds.length) {
    await XQodCourseUserQA.update(
      {
        verified: true,
        correct: false
      },
      {
        where: {
          user_qa_id: wrongAnswerIds
        }
      }
    )
  }
}

export const fetchAllEnrolledCourses = async ({ user_id }) => {
  const courses = await XQodUserCourse.findAll({
    attributes: ['course_id', 'status'],
    include: [
      {
        model: XQodCourse,
        as: 'courseDetails',
        required: false,
        attributes: [
          'course_id',
          'title',
          'rating',
          'language',
          'image_url',
          [Sequelize.literal('COUNT(DISTINCT(`courseDetails->students`.`user_id`))'), 'studentsCount'],
          [Sequelize.literal('COUNT(DISTINCT(`courseDetails->sections`.`section_id`))'), 'sectionsCount'],
          [Sequelize.literal('COUNT(DISTINCT(CASE WHEN `courseDetails->userTest`.`user_id` = ' + user_id +
            ' THEN `courseDetails->userTest`.`section_id` END))'), 'sectionsCompleted']
        ],
        include: [
          {
            model: XQodUserCourse,
            as: 'students',
            attributes: []
          },
          {
            model: XQodCourseSection,
            as: 'sections',
            attributes: []
          },
          {
            model: XQodCourseUserQA,
            as: 'userTest',
            attributes: []
          },
          {
            model: UserDetail,
            as: 'creatorDetails',
            attributes: [
              ['first_name', 'firstName'],
              ['last_name', 'lastName']
            ]
          }
        ],
        group: ['XQodCourse.course_id']
      }
    ],
    group: ['XQodUserCourse.course_id'],
    where: {
      user_id
    }
  })

  return courses && courses.map(item => item.get({ plain: true }))
}

export const formatEnrolledCoursesData = ({ courses }) => {
  return courses.map((item) => {
    return {
      courseId: item.course_id,
      status: item.status,
      courseTitle: item.courseDetails && item.courseDetails.title,
      rating: item.courseDetails && item.courseDetails.rating,
      studentsCount: item.courseDetails && item.courseDetails.studentsCount,
      creatorName: item.courseDetails && item.courseDetails.creatorDetails &&
      item.courseDetails.creatorDetails.firstName + ' ' + item.courseDetails.creatorDetails.lastName,
      sectionsCount: item.courseDetails && item.courseDetails.sectionsCount,
      language: item.courseDetails && item.courseDetails.language,
      courseImage: item.courseDetails && item.courseDetails.image_url,
      courseProgress: item.courseDetails && item.courseDetails.sectionsCount &&
      Math.round((item.courseDetails.sectionsCompleted / item.courseDetails.sectionsCount) * 100)
    }
  })
}

export const fetchAllCourses = async ({ offset, search_keyword, course_id }) => {
  let query = {}
  let additionalParams = {
    limit: 10,
    order: [
      ['course_id', 'ASC']
    ]
  }

  if (!_.isUndefined(offset)) {
    additionalParams = {
      ...additionalParams,
      offset: parseInt(offset)
    }
  }

  if (!_.isEmpty(search_keyword)) {
    query = {
      ...query,
      title: { [Op.substring]: search_keyword }
    }
  }

  if (!_.isUndefined(course_id)) {
    query = {
      ...query,
      course_id: { [Op.not]: course_id }
    }
  }

  const { rows, count } = await XQodCourse.findAndCountAll({
    attributes: ['course_id', 'title', 'createdAt', 'image_url'],
    include: [
      {
        model: UserDetail,
        as: 'creatorDetails',
        attributes: [
          ['first_name', 'firstName'],
          ['last_name', 'lastName']
        ]
      }
    ],
    where: {
      ...query,
      status: 'published'
    },
    ...additionalParams
  })

  if (rows && count) {
    return {
      courses: rows.map(item => item.get({ plain: true })),
      count
    }
  }
}

export const formatAllCourses = ({ courses }) => {
  return courses.map((course) => {
    return {
      courseId: course.course_id,
      courseTitle: course.title,
      createdAt: course.createdAt,
      courseImage: course.image_url,
      creatorName: course.creatorDetails && course.creatorDetails.firstName + ' ' + course.creatorDetails.lastName
    }
  })
}

export const fetchCourseRating = async ({ user_id, course_id }) => {
  const promiseArray = [
    () => XQodUserCourse.findOne({
      raw: true,
      attributes: ['user_course_id'],
      where: {
        course_id,
        user_id
      }
    }),
    () => XUserActivity.findOne({
      raw: true,
      attributes: ['user_activity_id'],
      where: {
        user_id,
        record_id: course_id,
        record_type: 'course'
      }
    }),
    () => XUserActivity.findAll({
      raw: true,
      attributes: [
        [Sequelize.literal('AVG(CASE WHEN `activity_type` = "rating_value" ' +
          'THEN `activity_value` END)'), 'value'],
        [Sequelize.literal('AVG(CASE WHEN `activity_type` = "rating_clarity" ' +
          'THEN `activity_value` END)'), 'clarity'],
        [Sequelize.literal('AVG(CASE WHEN `activity_type` = "rating_content" ' +
          'THEN `activity_value` END)'), 'content'],
        [Sequelize.literal('AVG(CASE WHEN `activity_type` = "rating_structure" ' +
          'THEN `activity_value` END)'), 'structure'],
        [Sequelize.literal('AVG(`activity_value`)'), 'totalAverageRating'],
        [Sequelize.literal('COUNT(DISTINCT(`user_id`))'), 'totalAverageRaters']
      ],
      where: {
        record_id: course_id,
        record_type: 'course'
      }
    })
  ]

  const [isEnrolled, userReview, ratingData] = await Promise.all(promiseArray.map(promise => promise()))

  return {
    isEnrolled,
    userReview,
    ratingData: ratingData && ratingData.length && ratingData[0]
  }
}

export const formatCourseRating = ({ rating }) => {
  return {
    addReviewAccess: !_.isNull(rating.isEnrolled) && _.isNull(rating.userReview),
    ratings: rating.ratingData && {
      value: _.isNull(rating.ratingData.value) ? 0 : rating.ratingData.value,
      clarity: _.isNull(rating.ratingData.clarity) ? 0 : rating.ratingData.clarity,
      content: _.isNull(rating.ratingData.content) ? 0 : rating.ratingData.content,
      structure: _.isNull(rating.ratingData.structure) ? 0 : rating.ratingData.structure,
      totalAverageRating: _.isNull(rating.ratingData.totalAverageRating) ? 0 : rating.ratingData.totalAverageRating,
      totalAverageRaters: rating.ratingData.totalAverageRaters
    }
  }
}

export const fetchCourseReviews = async ({ course_id, reviewFilter, offset }) => {
  let additionalParams = {
    limit: 6,
    group: ['XUserActivity.user_id'],
    order: [
      ['user_activity_id', 'ASC']
    ]
  }

  if (!_.isUndefined(offset)) {
    additionalParams = {
      ...additionalParams,
      offset: parseInt(offset)
    }
  }

  if (!_.isUndefined(reviewFilter)) {
    if (_.isEqual(reviewFilter, 'latest')) {
      additionalParams = {
        ...additionalParams,
        order: [
          ['created_on', 'DESC'],
          ...additionalParams.order
        ]
      }
    } else if (_.isEqual(reviewFilter, 'bestRating')) {
      additionalParams = {
        ...additionalParams,
        order: [
          [Sequelize.literal('rating'), 'DESC'],
          ...additionalParams.order
        ]
      }
    } else if (_.isEqual(reviewFilter, 'worstRating')) {
      additionalParams = {
        ...additionalParams,
        order: [
          [Sequelize.literal('rating'), 'ASC'],
          ...additionalParams.order
        ]
      }
    }
  }

  const { rows, count } = await XUserActivity.findAndCountAll({
    required: false,
    subQuery: false,
    attributes: [
      ['user_activity_id', 'id'],
      ['created_on', 'dateOfReview'],
      [Sequelize.literal('AVG(`activity_value`)'), 'rating'],
      [Sequelize.literal('(CASE WHEN `activity_type` = "rating_value" THEN `activity_custom` END)'), 'comment'],
      'user_id'
    ],
    include: [
      {
        model: UserDetail,
        as: 'userData',
        attributes: [
          ['first_name', 'firstName'],
          ['last_name', 'lastName'],
          ['work_title', 'userTitle'],
          ['profile_image', 'userPic']
        ]
      }
    ],
    where: {
      record_type: 'course',
      record_id: course_id
    },
    ...additionalParams
  })

  if (rows && count) {
    return {
      reviews: rows.map(item => item.get({ plain: true })),
      count: count.length
    }
  }
}

export const fetchCourseCompletionData = async ({ course_id, userIds }) => {
  const promiseArray = [
    () => XQodCourseSection.count({
      raw: true,
      where: {
        course_id
      }
    }),
    () => XQodCourseUserQA.findAll({
      raw: true,
      attributes: [
        'user_id',
        [Sequelize.literal('COUNT(DISTINCT(`section_id`))'), 'sectionsCompleted']
      ],
      group: ['user_id'],
      where: {
        user_id: userIds,
        course_id
      }
    })
  ]

  const [sectionsCount, sectionsCompletedData] = await Promise.all(promiseArray.map(promise => promise()))

  if (sectionsCount && sectionsCompletedData) {
    return userIds.map((id) => {
      const isSectionCompleted = sectionsCompletedData.find((item) => item.user_id === id)

      return {
        userId: id,
        courseProgress: Math.round(100 * (_.isUndefined(isSectionCompleted)
          ? 0
          : isSectionCompleted.sectionsCompleted) / sectionsCount)
      }
    })
  }
}

export const formatCourseReviewsData = ({ reviewsData, courseCompletionData }) => {
  return {
    count: reviewsData.count,
    reviews: reviewsData.reviews.map((item) => {
      const courseProgressData = courseCompletionData.find((data) => data.userId === item.user_id)
      return {
        id: item.id,
        rating: item.rating,
        comment: item.comment,
        userName: item.userData && item.userData.firstName && item.userData.lastName &&
          item.userData.firstName + ' ' + item.userData.lastName,
        userTitle: item.userData && item.userData.userTitle,
        userPic: item.userData && item.userData.userPic,
        dateOfReview: item.dateOfReview && formatDate(item.dateOfReview),
        courseProgress: courseProgressData && courseProgressData.courseProgress
      }
    })
  }
}

export const addCourseReview = async ({ user_id, course_id, reviewData }) => {
  const ratingData = [reviewData.value, reviewData.clarity, reviewData.content, reviewData.structure]

  const reviewEntries = ['rating_value', 'rating_clarity', 'rating_content', 'rating_structure'].map((item, index) => {
    return {
      user_id,
      record_type: 'course',
      record_id: course_id,
      activity_type: item,
      activity_value: ratingData[index],
      activity_custom: index === 0 ? reviewData.comment : null
    }
  })

  await XUserActivity.bulkCreate(reviewEntries)
}

export const updateCourseRating = async ({ course_id, rating }) => {
  await XQodCourse.update({
    rating
  }, {
    where: {
      course_id
    }
  })
}

export const fetchUserCourses = async ({ candidate_id }) => {
  const courses = await XQodUserCourse.findAll({
    attributes: ['course_id', 'date_started', 'date_completed', 'grade'],
    include: [
      {
        model: XQodCourse,
        as: 'courseDetails',
        attributes: ['title', 'createdAt'],
        include: [
          {
            model: UserDetail,
            as: 'creatorDetails',
            attributes: [
              ['first_name', 'firstName'],
              ['last_name', 'lastName']
            ]
          }
        ]
      }
    ],
    where: {
      user_id: candidate_id,
      status: 'completed'
    }
  })

  return courses && courses.map(course => course.get({ plain: true }))
}

export const formatUserCourseData = ({ courses }) => {
  return courses.map((course) => {
    return {
      courseId: course.course_id,
      courseTitle: course.courseDetails && course.courseDetails.title,
      dateStarted: course.date_started && formatDate(course.date_started),
      dateCompleted: course.date_completed && formatDate(course.date_completed),
      creatorName: course.courseDetails && course.courseDetails.creatorDetails &&
        course.courseDetails.creatorDetails.firstName + ' ' + course.courseDetails.creatorDetails.lastName,
      createdAt: course.courseDetails && formatDate(course.courseDetails.createdAt),
      grade: course.grade
    }
  })
}

export const getCourseDetails = async ({ courseIds }) => {
  const courses = await XQodCourse.findAll({
    attributes: ['course_id', 'title', 'createdAt', 'image_url'],
    include: [
      {
        model: UserDetail,
        as: 'creatorDetails',
        attributes: [
          ['first_name', 'firstName'],
          ['last_name', 'lastName']
        ]
      }
    ],
    where: {
      course_id: courseIds
    }
  })

  return courses && courses.map(item => item.get({ plain: true }))
}

export const checkTestEvaluation = async ({ user_id, course_id, section_id }) => {
  const isTestNotEvaluated = await XQodCourseUserQA.findOne({
    raw: true,
    where: {
      user_id,
      course_id,
      section_id,
      test_type: 'section_wise',
      verified: false
    }
  })

  return !isTestNotEvaluated
}

export const getUsetTestAnswers = async ({ user_id, course_id, section_id }) => {
  const userTestAnswers = await XQodCourseUserQA.findAll({
    raw: true,
    attributes: ['section_qa_id', 'answer', 'correct', 'updated_on'],
    where: {
      user_id,
      course_id,
      section_id,
      test_type: 'section_wise'
    }
  })

  return userTestAnswers
}

export const formatTestResultData = ({ questions, userTestAnswers }) => {
  const correctAnswers = userTestAnswers.filter((question) => question.correct).length

  return {
    gradingDate: _.max(userTestAnswers.map((answer) => answer.updated_on)),
    result: ((correctAnswers * 100) / questions.length) > config.get('passingPercentage') ? 'Passed' : 'Failed',
    correctAnswers,
    questions: formatTestResultQuestions({ questions, userTestAnswers })
  }
}

export const formatTestResultQuestions = ({ questions, userTestAnswers }) => {
  return questions.map((question) => {
    let options, correctOption, correctOptions, userOptions, scale
    const userAnswerData = userTestAnswers.find((answer) => answer.section_qa_id === question.section_qa_id)
    let userAnswer = userAnswerData && userAnswerData.answer

    if (_.isEqual(question.question_type, 'scale')) {
      scale = {
        minRange: question.option1 && parseInt(question.option1),
        maxRange: question.option2 && parseInt(question.option2)
      }
    }

    if (['multiple', 'checkbox'].includes(question.question_type)) {
      options = formatOptionsData({ question })
    }

    if (_.isEqual(question.question_type, 'multiple')) {
      const availableCorrectOption = options && options.find((option) => option.value === question.answer)
      const availableUserAnswer = options && options.find((option) => userAnswerData && option.value === userAnswerData.answer)
      correctOption = availableCorrectOption && availableCorrectOption.id
      userAnswer = availableUserAnswer && availableUserAnswer.id
    }

    if (_.isEqual(question.question_type, 'checkbox')) {
      const correctAnswers = JSON.parse(question.answer)
      const userAnswers = userAnswerData && JSON.parse(userAnswerData.answer)
      correctOptions = options && options.filter((option) => correctAnswers && correctAnswers.includes(option.value))
        .map((correctAnswer) => correctAnswer && correctAnswer.id)
      userOptions = options && options.filter((option) => userAnswers && userAnswers.includes(option.value))
        .map((userAnswer) => userAnswer && userAnswer.id)
    }

    return {
      id: question.section_qa_id,
      questionType: question.question_type,
      questionText: question.question,
      answerText: question.answer,
      options,
      correctOptions,
      correctOption,
      userAnswer,
      userOptions,
      isCorrect: !!(userAnswerData && userAnswerData.correct),
      scale,
      isAttempted: !!userAnswer
    }
  })
}
