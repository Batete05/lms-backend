const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("lms", "root", "12345", {
  host: "localhost",
  dialect: "mysql",
});

async function create_connection() {
  try {
    await sequelize.authenticate();
    console.log("connection has been established successfully");
  } catch (err) {
    console.log("Unable to connect to the database");
  }
}

create_connection();

module.exports = {
  sequelize,
  create_connection,
};
