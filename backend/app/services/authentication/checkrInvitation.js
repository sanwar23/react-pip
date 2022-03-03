import ServiceBase from '../../common/serviceBase'
import { getUserById, getUserDetails } from '../helper/user'
import { createNewCandidate, getOneCandidate, createNewInvitation } from '../helper/checkr'
import { decryptData } from '../../utils/encryption'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  }
}

export default class CheckrInvitationService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { user_id } = this.filteredArgs
    const promises = [
      () => getUserById({ user_id }),
      () => getUserDetails({ user_id })
    ]
    const [{ email }, { first_name, last_name, ssn, dob, zip }] = await Promise.all(promises.map(promise => promise()))

    const candidate = await getOneCandidate({ user_id })
    if (candidate) {
      switch (candidate.status) {
        case ('invitation.created'): {
          return {
            status: candidate.status,
            msg: 'Background Check Started!',
            checkrInvitationUrl: candidate.invitation_url
          }
        }
        case ('report.created'): {
          return {
            status: candidate.status,
            checkrInvitationUrl: null,
            msg: 'You have already completed the Background Test!'
          }
        }
        case ('report.completed'): {
          return {
            status: candidate.status,
            checkrInvitationUrl: null,
            msg: 'Background Check Completed'
          }
        }
      }
    }
    // Create User Candidate

    // Decrypt Dob, SSN
    const decryptedDob = decryptData(dob)
    const decryptedSsn = decryptData(ssn)

    const candidate_id = await createNewCandidate({
      user_id,
      first_name,
      last_name,
      email,
      dob: decryptedDob,
      ssn: decryptedSsn,
      zipcode: zip
    })

    // Send Invitation to Candidate
    const invitation_url = await createNewInvitation({ candidate_id })
    return {
      checkrInvitationUrl: invitation_url,
      status: 'invitation.created',
      msg: 'Background Check Started'
    }
  }
}
