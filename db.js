const mongoose = require("mongoose");
require("dotenv").config();
const url = process.env.CONNECTION_URL;

const db = () => {
  mongoose
    .connect(url)
    .then(() => {
      console.log(url);
      console.log("database Connected");
    })
    .catch((error) => {
      console.error("Something bad happened" + error);
    });
};

module.exports = db;
