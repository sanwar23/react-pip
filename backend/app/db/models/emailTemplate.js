'use strict'
module.exports = (sequelize, DataTypes) => {
  const EmailTemplate = sequelize.define('EmailTemplate', {
    email_template_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER(11)
    },
    client_id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    description: DataTypes.STRING(45),
    fromAddress: DataTypes.STRING(512),
    toAddress: DataTypes.STRING(512),
    cc: DataTypes.STRING(512),
    reply_to: DataTypes.STRING(512),
    subject: DataTypes.STRING(100),
    body: DataTypes.STRING(4000),
    active: DataTypes.STRING(3)
  },
  { tableName: 'x_email_templates' })
  EmailTemplate.associate = function (models) {}
  return EmailTemplate
}
