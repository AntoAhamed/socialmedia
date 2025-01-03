const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser")
const fileUpload = require("express-fileupload")
const cors = require("cors")
const path = require("path");

const app = express();

// Config
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "config/config.env" });
}

// Using Middlewares
const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser())
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(fileUpload())
app.use(cors(corsOptions));

// Importing Routes
const post = require("./routes/postRoutes");
const user = require("./routes/userRoutes");

// Using Routes
app.use("/api/v1", post);
app.use("/api/v1", user);

module.exports = app;
