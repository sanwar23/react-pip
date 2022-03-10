import config from '../config/app';
import * as express from './express';
import logger from '../app/common/logger';
import db from '../app/db/models';

const closeAllProcesses = (server) => {
  console.log(
    '\x1b[32m%s\x1b[0m',
    '[Close server] Graceful shutdown server...'
  );
  server.close(() => {
    console.log('\x1b[32m%s\x1b[0m', 'Express server closed.');
    db.sequelize
      .close()
      .then(() => {
        console.log('\x1b[32m%s\x1b[0m', 'Database connection closed.');
        process.exit(0);
      })
      .catch((err) => {
        logger.error(
          `Error occured while closing the database connection ${err}`
        );
      });
  });
};

const start = async () => {
  const port = config.get('port');
  const appStartMessage = () => {
    const env = process.env.NODE_ENV;
    logger.debug('Initializing Backend');
    logger.info(`Server Name : ${config.get('app.name')}`);
    logger.info(`Environment  : ${env || 'development'}`);
    logger.info(`App Port : ${port}`);
    logger.info(`Process Id : ${process.pid}`);
  };
  const app = express.init();

  const server = app.listen(port, appStartMessage);

  process.on('SIGTERM', () => closeAllProcesses(server));
  process.on('SIGINT', () => closeAllProcesses(server));
};

export default start;
