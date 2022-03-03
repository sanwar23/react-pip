import ServiceBase from '../../common/serviceBase';
import jwt from 'jsonwebtoken';
import { User, UserDetail } from '../../db/models';
import { CreateUserGroupService } from './createUserGroup';
import config from '../../../config/app';
import { ERRORS } from '../../utils/errors';
import { CONSTANTS } from '../../utils/success';

const constraints = {
  token: {
    presence: { allowEmpty: false },
  },
};

export default class VerifyTokenService extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    return jwt.verify(
      this.args.token,
      config.get('jwt.emailVerificationTokenSecret'),
      async (err, jwtVerified) => {
        if (err) {
          this.addError(
            ERRORS.BAD_REQUEST,
            'Verification link is expired or invalid'
          );
          return;
        }
        if (jwtVerified) {
          const user = await User.findOne({
            where: { user_id: jwtVerified.user_id },
            raw: true,
          });
          if (!user.email_verified) {
            // Create User Group
            const newUserGroup = await CreateUserGroupService.execute({
              id: user.user_id,
              full_name: user.full_name,
            });
            await User.update(
              {
                email_verified: true,
                user_group: newUserGroup.user_group,
              },
              { where: { email: jwtVerified.email } }
            );

            const userData = await UserDetail.findOne({
              where: { user_id: user.user_id },
            });
            const jwtToken = await jwt.sign(
              {
                email: jwtVerified.email,
                user_id: user.user_id,
                full_name: user.full_name,
                is_post_signup_completed: userData.is_post_signup_completed,
              },
              config.get('jwt.loginTokenSecret'),
              {
                expiresIn: config.get('jwt.loginTokenExpiry'),
              }
            );
            return {
              message: 'Email Verified Successfully!!',
              token_type: CONSTANTS.VERIFY_EMAIL_TOKEN_TYPE,
              accessToken: jwtToken,
            };
          } else {
            if (
              jwtVerified.token_type === CONSTANTS.FORGET_PASSWORD_TOKEN_TYPE
            ) {
              return {
                message: 'Forget Password Email Verified Successfully!!',
                token_type: CONSTANTS.FORGET_PASSWORD_TOKEN_TYPE,
                email: jwtVerified.email,
              };
            }
            if (jwtVerified.token_type === CONSTANTS.RESET_EMAIL_TOKEN_TYPE) {
              const result = await User.update(
                {
                  email: jwtVerified.newEmail,
                },
                { where: { user_id: user.user_id } }
              );

              if (result) {
                return {
                  message: 'Email Reset and Verified Successfully!!',
                  token_type: CONSTANTS.RESET_EMAIL_TOKEN_TYPE,
                  email: jwtVerified.newEmail,
                };
              }
            }
            return 'Email already verified Successfully!!';
          }
        }
      }
    );
  }
}
