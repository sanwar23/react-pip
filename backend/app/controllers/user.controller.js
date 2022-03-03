import config from '../../config/app';

export default class UserController {
  static async signIn(req, res) {
    const user = req.body.username;
    const pass = req.body.password;

    const username = config.get('auth_user.user_name');
    const password = config.get('auth_user.password');

    if (user === username && pass === password) {
      const token = Buffer.from(username + ':' + password).toString('base64');

      res.cookie('access_token', token, {
        maxAge: config.get('cookieMaxAge'),
      });

      res.status(200).json({ message: 'User login successfull' });
    } else {
      res.status(401).json({ message: 'User login failed' });
    }
  }
}
