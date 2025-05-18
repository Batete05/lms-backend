const { verifyToken } = require("../../../middlewares/verifyToken");
const { validateBook } = require("../../validators/bookValidator");
const { Book } = require("../../../models/book");
const { Op } = require("sequelize");
const { authorizeRoles } = require("../../../middlewares/authMiddleware");
const { sequelize } = require("../../../config/dbConnection");

const router = require("express").Router();

require("dotenv").config();

router.post("/", verifyToken, authorizeRoles("ADMIN"), async (req, res) => {
  try {
    const { error } = validateBook(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const existByIsbn = await Book.findOne({
      where: { bookIsbn: req.body.bookIsbn },
    });

    if (existByIsbn) {
      return res.status(400).json({ message: "This book already exist" });
    }

    const newBook = await Book.create({
      bookName: req.body.bookName,
      author: req.body.author,
      publisher: req.body.publisher,
      publishedYear: req.body.publishedYear,
      subject: req.body.subject,
      bookIsbn: req.body.bookIsbn,
    });

    return res.status(200).json({ message: "Success Book added" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.get("/all", async (req, res) => {
  try {
    const findBook = await Book.findAll();
    if (!findBook) {
      return res.status(400).jaon({ message: "Can't get any Book" });
    }
    return res.status(200).json({ message: findBook });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.put(
  "/update/:id",
  verifyToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const userId = req.params.id;
      const updatedData = req.body;

      const [updatedRowsCount] = await Book.update(updatedData, {
        where: { id: userId },
      });

      if (updatedRowsCount === 0) {
        return res
          .status(404)
          .json({ message: "Book not found or no changes made" });
      }

      // Fetch the updated Book data
      const updatedBook = await Book.findByPk(userId);

      return res.status(200).json(updatedBook);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
);

router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    const bookToDelete = await Book.findByPk(req.params.id);
    if (!Book) {
      return res.status(404).json({ message: "Book not found" });
    }
    await Book.destroy();
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete Book Error: " + err.message });
  }
});

// READ all Books with pagination
router.get("/", verifyToken, async (req, res) => {
  try {
    // Read query parameters for pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    const { count, rows: Books } = await Book.findAndCountAll({
      offset,
      limit,
      order: [
        ["id", "DESC"],
        ["createdAt", "DESC"],
      ],
    });
    // http://localhost:5000/v1/Book?page=2&limit=2
    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      Books,
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: page,
        perPage: limit,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch Books", error: err.message });
  }
});

router.get("/search", async (req, res) => {
  const searchKeyword = req.query.q;
  if (!searchKeyword) {
    return res.status(400).json({ message: "Search keyword is required" });
  }
  try {
    const Books = await Book.findAll({
      where: {
        [Op.or]: [
          { bookName: { [Op.iLike]: `%${searchKeyword}%` } },
          { author: { [Op.iLike]: `%${searchKeyword}%` } },
          { publisher: { [Op.iLike]: `%${searchKeyword}%` } },
          { publishedYear: { [Op.iLike]: `%${searchKeyword}%` } },
          { subject: { [Op.iLike]: `%${searchKeyword}%` } },
        ],
      },
    });
    return res.send({ Books });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
