const express = require("express");
const app = express();
const test = require("./Router/test");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { User } = require("./models/User");
const config = require("./config/key");
//클라이언트에서 오는 정보를 서버에서 분석해서 가져올 수 있다.
app.use(bodyParser.urlencoded({ extended: true }));

//json 타입으로 된 것을 분석해서 가져올 수 있다.
app.use(bodyParser.json());

mongoose
  .connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

//app.use("/api", test);

app.post("/register", (req, res) => {
  //회원 가입 할 때 필요한 정보를 client 에서 가져오면 그것을 데이터베이스에 넣어준다.

  const user = new User(req.body);

  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});
const port = 5000;
app.listen(port, () => console.log(`${port}`));
