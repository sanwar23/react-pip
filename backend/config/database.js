const config = require('./app')

module.exports = {
  development: {
    username: config.get('sequelize.user'),
    password: config.get('sequelize.password'),
    database: config.get('sequelize.name'),
    host: config.get('sequelize.host'),
    logging: false,
    dialect: 'mariadb',
    dialectOptions: {
      timezone: 'Etc/GMT0'
    },
    define: {
      timestamps: false,
      charset: 'latin1',
      collate: 'latin1_swedish_ci'
    }
  },
  test: {
    username: config.get('sequelize.user'),
    password: config.get('sequelize.password'),
    database: config.get('sequelize.name'),
    host: config.get('sequelize.host'),
    dialect: 'mariadb',
    define: {
      timestamps: false,
      charset: 'latin1',
      collate: 'latin1_swedish_ci'
    }
  },
  staging: {
    username: config.get('sequelize.user'),
    password: config.get('sequelize.password'),
    database: config.get('sequelize.name'),
    host: config.get('sequelize.host'),
    dialect: 'mariadb',
    define: {
      timestamps: false,
      charset: 'latin1',
      collate: 'latin1_swedish_ci'
    }
  },
  production: {
    username: config.get('sequelize.user'),
    password: config.get('sequelize.password'),
    database: config.get('sequelize.name'),
    host: config.get('sequelize.host'),
    dialect: 'mariadb',
    define: {
      timestamps: false,
      charset: 'latin1',
      collate: 'latin1_swedish_ci'
    }
  }
}
