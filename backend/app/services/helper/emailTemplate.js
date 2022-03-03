import { EmailTemplate } from '../../db/models'

export const getEmailTemplateByTemplateId = ({ email_template_id }) => {
  return EmailTemplate.findOne({ where: { email_template_id }, raw: true })
}
