const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();

// Routers
const loginWithInternetRoute = require("./controllers/routes/auth/loginUser");
// const loginWithoutInternetRoute = require("./controllers/routes/auth/LoginInWithoutInternet");
const registerWithInternetRoute = require("./controllers/routes/auth/registerUser");
// const registerWithoutInternetRoute = require("./controllers/routes/auth/registerWithoutInternet");
const bookRegistry= require("./controllers/routes/books/book")
const { create_connection } = require("./config/dbConnection");
const { annotations } = require("./documentation/swagger");
const requestBook=require("./controllers/routes/books/requestBook")
// Initialize express app
const app = express();

// Database connection
create_connection();
// require('./config/sync_database')

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

// Route
app.use("/v1/auth/net/login", loginWithInternetRoute);
// app.use("/v1/auth/login", loginWithoutInternetRoute),
app.use("/v1/auth/net/register", registerWithInternetRoute),
// app.use("/v1/auth/register", registerWithoutInternetRoute);
app.use("/v1/book/", bookRegistry);
app.use("/v1/verify",require("./controllers/routes/auth/verification"))
app.use("/v1/bookrequest/",requestBook)
app.use("/v1/api/swagger", swaggerUi.serve, swaggerUi.setup(annotations));

// Root Endpoint
app.get("/", async (req, res) => {
  try {
    return res.status(200).send("<h1>...LIVE...</h1>");
  } catch (error) {
    // logger.error('Error in root endpoint:', error);
    return res.status(500).send(error.message);
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  // logger.info(`Server is running on port ${PORT}`);
  console.log(`app running at port ${PORT}`);
});
