const express = require("express");
const app = express();
const test = require("./Router/test");
const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://hyebin:abcd1234@cluster0.6vjis.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));
app.use("/api", test);

const port = 5000;
app.listen(port, () => console.log(`${port}`));
