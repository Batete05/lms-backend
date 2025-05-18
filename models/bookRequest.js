// models/BookRequest.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConnection");

const BookRequest = sequelize.define(
  "BookRequest",
  {
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      defaultValue: "pending",
    },
    studentName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bookName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

// // Associations using string keys (not recommended but possible)
// BookRequest.belongsTo(Book, {
//   foreignKey: "bookName",
//   targetKey: "bookName", // Make sure Book model has bookName field
//   allowNull: false,
// });

// BookRequest.belongsTo(User, {
//   foreignKey: "studentName",
//   targetKey: "fullName", // Make sure User model has 'name'
//   allowNull: false,
// });

module.exports = BookRequest;
