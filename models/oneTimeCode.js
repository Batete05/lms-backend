const { DataTypes } = require("sequelize");
const { Sequelize, sequelize } = require("../config/dbConnection");

const OneTimeCode = sequelize.define("OneTimeCode", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  isUsed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = { OneTimeCode };
