'use strict'
module.exports = (sequelize, DataTypes) => {
  const XQodApplication = sequelize.define('XQodApplication', {
    application_id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    user_id: DataTypes.INTEGER(11),
    client_id: DataTypes.INTEGER(11),
    job_id: DataTypes.INTEGER(11),
    cover_letter: DataTypes.TEXT,
    video_pitch_url: DataTypes.STRING(100),
    status: {
      type: DataTypes.ENUM,
      values: [
        'published',
        'applied',
        'invited',
        'screening',
        'training',
        'offered',
        'hired',
        'rejected',
        'declined',
        'resigned',
        'terminated'
      ],
      defaultValue: 'published'
    },
    status_reason: DataTypes.STRING,
    start_date: {
      type: DataTypes.DATE
    },
    end_date: {
      type: DataTypes.DATE
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    createdAt: {
      field: 'created_on',
      type: DataTypes.DATE
    },
    updatedAt: {
      field: 'updated_on',
      type: DataTypes.DATE
    }
  },
  {
    tableName: 'x_qod_applications',
    timestamps: true
  })
  XQodApplication.associate = function (models) {
    // Adding association with x_user_details table
    XQodApplication.belongsTo(models.UserDetail, { foreignKey: 'user_id' })
    XQodApplication.belongsTo(models.XClient, { foreignKey: 'client_id' })
    XQodApplication.belongsTo(models.XQodJob, { foreignKey: 'job_id' })
  }
  return XQodApplication
}
