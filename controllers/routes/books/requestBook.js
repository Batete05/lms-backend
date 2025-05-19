// routes/bookRequest.js
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../../middlewares/verifyToken");
const { authorizeRoles } = require("../../../middlewares/authMiddleware");

const Book = require("../../../models/book");
const User = require("../../../models/user");
const BookRequest = require("../../../models/bookRequest");

router.post("/", verifyToken, authorizeRoles("STUDENT"), async (req, res) => {
  try {
    const { bookName } = req.body;

    const book = await Book.findOne({ where: { bookName } });
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const student = await User.findByPk(req.user.id);
    if (!student) {
      return res.status(404).json({ message: "Student user not found" });
    }

    const request = await BookRequest.create({
      bookId: book.id,
      studentId: student.id,
      status: "pending",
    });

    res.status(201).json({ message: "Book request submitted", request });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/", verifyToken, authorizeRoles("ADMIN"), async (req, res) => {
  try {
    const books = await BookRequest.findAll({
      include: [
        { model: User, as: "student", attributes: ["id", "name", "email"] },
        { model: Book, as: "book", attributes: ["id", "bookName"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (!books.length) {
      return res.status(404).json({ message: "No book requests found" });
    }

    return res.status(200).json({
      message: "Book requests fetched successfully",
      requests: books,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
});

module.exports = router;
