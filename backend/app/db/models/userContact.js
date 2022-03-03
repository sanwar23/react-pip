'use strict'
module.exports = (sequelize, DataTypes) => {
  const UserContact = sequelize.define('UserContact', {
    user_contact_id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    referral_email: DataTypes.STRING,
    user_credit: {
      defaultValue: 0,
      type: DataTypes.INTEGER
    },
    referral_credit: {
      defaultValue: 0,
      type: DataTypes.INTEGER
    },
    sent: {
      type: DataTypes.DATE
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: 'x_user_contacts'
  })
  UserContact.associate = function (models) {}
  return UserContact
}
