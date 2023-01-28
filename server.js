require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");

const userRouter = require("./routes/users.routes");

// initialise express app
const app = express();

// middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));

const mongourl =
  process.env.MONGOURL || "mongodb://localhost:27017/socialmedia";
const port = process.env.PORT || 5000;

// connecting to database then start server
mongoose.set("strictQuery", true);
mongoose
  .connect(mongourl)
  .then(() => {
    app.listen(port, () => console.log("server is listening on port " + port));
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.send("home page");
});

app.use("/users", userRouter);
