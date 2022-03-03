import config from '../../config/app';

var basicAuth = require('basic-auth');

const isAuth = (req, res, next) => {
  console.log('middleware: basic auth');
  // console.log(req.headers);
  var user = basicAuth(req);

  const username = config.get('auth_user.user_name');
  const password = config.get('auth_user.password');

  if (!user || !user.name || !user.pass) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    res.sendStatus(401);
  }

  if (user.name === username && user.pass === password) {
    console.log('Authentication passed');
    next();
  } else {
    console.log('Authentication FAiled');
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    res.sendStatus(401);
  }
};

export default isAuth;
