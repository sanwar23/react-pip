import passport from 'passport'

export function isAuthenticated (req, res, next) {
  passport.authenticate('jwt', (err, user) => {
    if (err) {
      return res.status(401).json({ message: err })
    }
    req.login(user, loginErr => {
      if (loginErr) {
        return res.status(401).send(loginErr)
      }

      req.body.user = user
      req.body.user_id = user.user_id
      next()
    })
  })(req, res, next)
}
