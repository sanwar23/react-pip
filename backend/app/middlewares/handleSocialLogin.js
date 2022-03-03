import config from '../../config/app'

export function handleSocialLogin (req, res) {
  if (req.user.email_verified) {
    res.cookie('access_token', req.user.accessToken, {
      maxAge: config.get('cookieMaxAge')
    })
  } else {
    res.cookie('is_email_verified', false)
  }
  res.redirect(`${config.get('webApp.baseUrl')}/auth`)
}
