const express = require("express");
const app = express();
const config = require("./config/key");
//클라이언트에서 오는 정보를 서버에서 분석해서 가져올 수 있다.
const cors = require("cors");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
app.use(bodyParser.urlencoded({ extended: true }));

//json 타입으로 된 것을 분석해서 가져올 수 있다.
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.use("/api/users", require("./routes/users"));
app.use("/api/todo", require("./routes/todo"));
app.use("/uploads", express.static("uploads"));

app.get("/api/hello", (req, res) => {
  res.send("안녕하세요~");
});

const port = 5000;
app.listen(port, () => console.log(`${port}`));
