import ServiceBase from '../../common/serviceBase'
import { Flow, FlowPage, FlowField } from '../../db/models'
import {
  createNewEntity,
  getFlowFieldsByFlowAndPageId,
  getErrorMessageForService
} from '../helper'
import { ERRORS, MESSAGES } from '../../utils/errors'
import logger from '../../common/logger'

const constraints = {
  flowId: {
    presence: { allowEmpty: false }
  },
  flowName: {
    presence: false
  },
  flowDescription: {
    presence: false
  }
}

export class CopyFlowService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      // Check if flow_id is valid or not
      const existingFlow = await Flow.findOne({ where: { flow_id: this.flowId }, raw: true })

      if (!(existingFlow && existingFlow['flow_id'])) {
        this.addError(ERRORS.NOT_FOUND, MESSAGES.FLOW_NOT_EXIST)
        return
      }

      const newFlowData = {
        client_id: existingFlow.client_id,
        flow_name: this.flowName,
        flow_description: this.flowDescription
      }

      // Adding new flow
      const addedFlowData = await createNewEntity({ model: Flow, data: newFlowData })

      // Adding previous flow pages and fields
      if (addedFlowData.flow_id > 0) {
        // Get existing pages
        const flowPages = await FlowPage.findAll({
          where: { flow_id: existingFlow.flow_id },
          order: [['page_id', 'ASC']],
          raw: true
        })

        if (flowPages && flowPages.length) {
          const addFlowPageAndFieldPromises = []

          const pagesMap = {}
          const fieldsMap = {}

          flowPages.forEach((existingPage) => {
            addFlowPageAndFieldPromises.push(() => this.addFlowPageAndField({
              existingPage: existingPage,
              newFlowId: addedFlowData.flow_id,
              pagesMap,
              fieldsMap
            }))
          })

          // Here we're are adding page and field parallelly in the database
          await Promise.all(addFlowPageAndFieldPromises.map((promise) => promise()))

          // update new field / page references
          const newFields = await FlowField.findAll({ where: { flow_id: addedFlowData.flow_id }, raw: true })

          const updateFlowFieldPromises = []
          newFields.forEach((field) => {
            updateFlowFieldPromises.push(() => this.updateFlowField({ field, pagesMap, fieldsMap }))
          })

          await Promise.all(updateFlowFieldPromises.map((promise) => promise()))

          return newFlowData
        }
      }
    } catch (err) {
      logger.error(`${getErrorMessageForService('CopyFlowService')} ${err}`)
      this.addError(ERRORS.INTERNAL)
    }
  }

  async addFlowPageAndField ({ existingPage, newFlowId, pagesMap, fieldsMap }) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      const newPage = {
        flow_id: newFlowId,
        page_name: existingPage.page_name,
        page_description: existingPage.page_description,
        page_bg_color: existingPage.page_bg_color,
        default_disposition: existingPage.default_disposition,
        randomize_pages_off: existingPage.randomize_pages_off
      }

      const newFlowPage = await createNewEntity({ model: FlowPage, data: newPage })

      if (newFlowPage.page_id > 0) {
        pagesMap[existingPage.page_id] = newFlowPage.page_id

        const existingFields = await getFlowFieldsByFlowAndPageId({
          page: existingPage.page_id,
          flow_id: existingPage.flow_id
        })

        if (existingFields && existingFields.length) {
          const promises = []

          existingFields.forEach((existingField) => {
            const flowField = {
              ...existingField,
              field_id: 0,
              flow_id: newFlowId,
              page: newFlowPage.page_id
            }

            promises.push(() => this.createFlowField({ existingField, flowField, fieldsMap }))
          })

          // Parallelly adding all the fields
          await Promise.all(promises.map((promise) => promise()))
        }
      }
      resolve()
    })
  }

  async updateFlowField ({ field, pagesMap, fieldsMap }) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      let fieldUpdated = false

      // basic navigations for pages..
      if (field.goto_page > 0) {
        field.goto_page = pagesMap[field.goto_page]
        fieldUpdated = true
      }

      // fields..
      if (field.goto_field && field.goto_field.trim()) {
        // goto_field can have field_id
        const goto_field = parseInt(field.goto_field)

        if (!isNaN(goto_field) && goto_field > 0) {
          field.goto_field = fieldsMap[goto_field] + ''
          fieldUpdated = true
        }
      }

      // and conditions
      if (field.field_type === 'CONDITION') {
        if (field.field_options && field.field_options.trim()) {
          let conditionsUpdated = false
          const conditions = field.field_options.split('\n')
          field.field_options = ''

          conditions.forEach((condition) => {
            if (condition && condition.trim()) {
              const conditionParts = condition.split('|')

              if (conditionParts.Length > 6) {
                const goToField = parseInt(conditionParts[6])
                // goToField can have field_id
                if (!isNaN(goToField) && goToField > 0) {
                  conditionParts[6] = fieldsMap[goToField] + ''
                  conditionsUpdated = true
                }
              }

              if (conditionParts.Length > 4) {
                const goToField = parseInt(conditionParts[4])
                // goToField can have field_id
                if (!isNaN(goToField) && goToField > 0) {
                  conditionParts[4] = fieldsMap[goToField] + ''
                  conditionsUpdated = true
                }
              }

              if (conditionParts.Length > 3) {
                const goToPage = parseInt(conditionParts[3])
                if (!isNaN(goToPage) && goToPage > 0) {
                  conditionParts[3] = pagesMap[goToPage] + ''
                  conditionsUpdated = true
                }
              }

              if (conditionsUpdated) {
                if (conditionParts.Length > 6) {
                  field.field_options += `${conditionParts[0]}|${conditionParts[1]}|${conditionParts[2]}|${conditionParts[3]}|${conditionParts[4]}|${conditionParts[5]}|${conditionParts[6]}\n`
                } else if (conditionParts.Length > 5) {
                  field.field_options += `${conditionParts[0]}|${conditionParts[1]}|${conditionParts[2]}|${conditionParts[3]}|${conditionParts[4]}|${conditionParts[5]}\n`
                } else {
                  field.field_options += `${conditionParts[0]}|${conditionParts[1]}|${conditionParts[2]}|${conditionParts[3]}|${conditionParts[4]}\n`
                }
                fieldUpdated = true
              }
            }
          })
        }
      }

      if (fieldUpdated) {
        await FlowField.update(field, { where: { field_id: field['field_id'] } })
      }

      resolve()
    })
  }

  async createFlowField ({ existingField, flowField, fieldsMap }) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      const newField = await createNewEntity({ model: FlowField, data: flowField })
      fieldsMap[existingField.field_id] = newField.field_id
      resolve()
    })
  }
}
