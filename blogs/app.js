// const http = require("http");
const express = require("express");
const app = express();
const cors = require("cors");
const blogRouter = require("./controllers/blogs");
const mongoose = require("mongoose");
const config = require("./utils/config");

mongoose.set("strictQuery", false);

const mongoUrl = config.MONGODB_URL;
mongoose.connect(mongoUrl);

app.use(cors());
app.use(express.json());
app.use("/api/blogs", blogRouter);

module.exports = app;
