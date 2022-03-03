import passport from 'passport'
import TwitterStrategy from 'passport-twitter'
import { Strategy as FacebookStrategy } from 'passport-facebook'
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as JwtStrategy } from 'passport-jwt'
import jwt from 'jsonwebtoken'
import { User, UserDetail } from '../db/models'
import config from '../../config/app'
import SocialSignup from '../services/signup/socialSignup'
import { APP_ERROR_CODES } from '../utils/errors'
import { getOne, getInviteLink } from '../services/helper'

function initPassport () {
  const opts = {}
  opts.jwtFromRequest = getAccessTokenFromCookie
  opts.secretOrKey = config.get('jwt.loginTokenSecret')

  passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false
  },
  async function (email, password, done) {
    const user = await User.findOne({ where: { email } })
    if (user == null) {
      return done({ message: APP_ERROR_CODES.EMAIL_NOT_REGISTERED, code: 'EMAIL_NOT_REGISTERED' }, null)
    } else {
      if (!await user.comparePassword(password)) {
        return done({ message: APP_ERROR_CODES.INCORRECT_PASSWORD, code: 'INCORRECT_PASSWORD' }, null)
      }
      if (!user.email_verified) {
        return done({ message: APP_ERROR_CODES.EMAIL_NOT_VERIFIED, code: 'EMAIL_NOT_VERIFIED' }, null)
      } else {
        const userObj = user.get({ plain: true })
        const inviteLink = await getInviteLink({ user_id: user.user_id })
        const userDetailsData = await getOne({
          model: UserDetail,
          data: { user_id: user.user_id },
          attributes: ['is_post_signup_completed']
        })
        const jwtToken = await jwt.sign({
          email,
          full_name: user.full_name,
          user_id: user.user_id,
          is_post_signup_completed: !!(userDetailsData && userDetailsData.is_post_signup_completed),
          user_code: user.user_code,
          inviteLink
        },
        config.get('jwt.loginTokenSecret'), {
          expiresIn: config.get('jwt.loginTokenExpiry')
        })
        userObj.accessToken = jwtToken
        return done(null, userObj)
      }
    }
  })
  )

  passport.use(new JwtStrategy(opts, async function (jwt_payload, done) {
    const user = await User.findOne({ where: { user_id: jwt_payload.user_id }, raw: true })
    if (user) {
      return done(null, user)
    } else {
      return done('User not found')
    }
  }))

  passport.use(new TwitterStrategy({
    consumerKey: config.get('twitter.consumerKey'),
    consumerSecret: config.get('twitter.consumerSecret'),
    callbackURL: config.get('twitter.callbackURL'),
    userProfileURL: 'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true',
    proxy: false
  }, async function (token, tokenSecret, profile, done) {
    if (profile) {
      const userDetailsJson = profile._json
      const userObj = {
        type: 'twitter_id',
        full_name: userDetailsJson.name,
        id: userDetailsJson.id,
        email: userDetailsJson.email
      }
      const user = await SocialSignup.run(userObj)
      const jwtToken = await signAccessToken(user)
      user.accessToken = jwtToken
      return done(null, user)
    }
  }
  ))

  passport.use(new FacebookStrategy({
    clientID: config.get('facebook.appId'),
    clientSecret: config.get('facebook.appSecret'),
    callbackURL: config.get('facebook.callbackURL'),
    profileFields: ['email', 'name']
  }, async function (accessToken, refreshToken, profile, done) {
    if (profile) {
      if (profile._json) {
        const userDetailsJson = profile._json
        const userObj = {
          type: 'facebook_id',
          full_name: userDetailsJson.first_name + ' ' + userDetailsJson.last_name,
          id: userDetailsJson.id,
          email: userDetailsJson.email
        }
        const user = await SocialSignup.run(userObj)
        const jwtToken = await signAccessToken(user)
        user.accessToken = jwtToken
        return done(null, user)
      }
    }
  }
  ))

  passport.use(new LinkedInStrategy({
    clientID: config.get('linkedin.apiKey'),
    clientSecret: config.get('linkedin.secretkey'),
    callbackURL: config.get('linkedin.callbackURL'),
    scope: ['r_emailaddress', 'r_liteprofile']
  }, async function (req, accessToken, refreshToken, profile, done) {
    if (profile) {
      const userObj = {
        type: 'linkedin_id',
        full_name: profile.displayName,
        id: profile.id,
        email: profile.emails[0].value
      }
      const user = await SocialSignup.run(userObj)
      const jwtToken = await signAccessToken(user)
      user.accessToken = jwtToken
      return done(null, user)
    }
  }
  ))

  passport.serializeUser(function (user, done) {
    done(null, user)
  })

  passport.deserializeUser(function (obj, done) {
    done(null, obj)
  })
}

const getAccessTokenFromCookie = function (req) {
  let accessToken = null
  if (req && req.cookies) {
    accessToken = req.cookies['access_token']
  }
  return accessToken
}

const signAccessToken = async function (user) {
  const inviteLink = await getInviteLink({ user_id: user.user_id })
  const userDetailsData = await getOne({
    model: UserDetail,
    data: {
      user_id: user.user_id
    },
    attributes: ['is_post_signup_completed']
  })
  const jwtToken = await jwt.sign({
    email: user.email,
    full_name: user.full_name,
    user_id: user.user_id,
    is_post_signup_completed: !!(userDetailsData && userDetailsData.is_post_signup_completed),
    user_code: user.user_code,
    inviteLink
  },
  config.get('jwt.loginTokenSecret'), {
    expiresIn: config.get('jwt.loginTokenExpiry')
  })
  return jwtToken
}

module.exports = initPassport
