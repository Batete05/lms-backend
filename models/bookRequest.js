// models/bookRequest.js
module.exports = (sequelize, DataTypes) => {
  const BookRequest = sequelize.define("BookRequest", {
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending",
    },
  });

  BookRequest.associate = (models) => {
    BookRequest.belongsTo(models.User, { foreignKey: "studentId", as: "student" });
    BookRequest.belongsTo(models.Book, { foreignKey: "bookId", as: "book" });
  };

  return BookRequest;
};

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

// module.exports = BookRequest;
