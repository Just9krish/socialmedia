const express = require("express");
const app = express();

const userRouter = require("./routes/users.routes");

app.get("/", (req, res) => {
  res.send("home page");
});

app.use("user");
