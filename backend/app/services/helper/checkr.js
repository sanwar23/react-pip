import { createNewEntity } from './common'
import { UserScreeningDetail } from '../../db/models'
import CheckrClient from '../authentication/checkrApis'
import { getOne } from './crud'

export async function createNewCandidate ({ user_id, first_name, last_name, email, dob, ssn, zipcode }) {
  const { id } = await CheckrClient.createCandidate({
    first_name,
    last_name,
    email,
    dob,
    ssn,
    zipcode
  })

  const checkrCandidate = await createNewEntity({
    model: UserScreeningDetail,
    data: {
      user_id,
      candidate_id: id,
      status: 'candidate.created'
    }
  })
  return checkrCandidate.candidate_id
}

export async function createNewInvitation ({ candidate_id }) {
  const { invitation_url, id } = await CheckrClient.createInvitation({ candidate_id })
  if (invitation_url) {
    await UserScreeningDetail.update({
      invitation_url,
      invitation_id: id,
      status: 'invitation.created'
    }, { where: { candidate_id } })
    return invitation_url
  }
}

export async function getOneCandidate ({ user_id }) {
  return await getOne({
    model: UserScreeningDetail,
    data: {
      user_id
    }
  })
}

export async function updateUserScreeningDetail ({ candidate_id, data }) {
  await UserScreeningDetail.update(data, { where: { candidate_id } })
}
