const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConnection");

const Book = sequelize.define("Book", {
  bookName: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey:true,

  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  publisher: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  publishedYear: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  bookIsbn: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
});

module.exports = {
  Book,
};
