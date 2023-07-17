"use strict";
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
// import routes
const authRoutes = require("./src/routes/auth")

// app
const app = express();

// db
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connected"))
  .catch((err) => {
    console.error(`error ${err.message}`);
  });

// middlewares
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cors());

// routes middleware
app.use("/api/v1",authRoutes);

app.get("/", (req, res) => {
  res.send("Hello from Chekka!");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

