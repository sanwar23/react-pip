'use strict'
module.exports = (sequelize, DataTypes) => {
  const UserScreeningDetail = sequelize.define('UserScreeningDetail', {
    user_screening_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER(9).UNSIGNED
    },
    user_id: {
      type: DataTypes.INTEGER(9)
    },
    candidate_id: DataTypes.STRING,
    report_id: DataTypes.STRING,
    invitation_url: DataTypes.STRING,
    invitation_id: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM,
      values: [
        'candidate.created',
        'invitation.created',
        'invitation.completed',
        'report.created',
        'report.completed'
      ]
    }
  },
  { tableName: 'x_user_screening_details' })

  return UserScreeningDetail
}
