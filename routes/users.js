const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const { User } = require("../models/User");
//================================
//             User
//================================
//auth는 미들웨어
//미들웨어 : 리퀘스트 받고 콜백전 중간에서 해주는것
router.get("/auth", auth, (req, res) => {
  //여기까지 미들웨어를 통과해 왔다는 이야기를 auth가 true라는 말
  res.status(200).json({
    _id: req.user._id,
    //role이 0이면 일반유저, 0이 아니면 관리자로 표현
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
    cart: req.user.cart,
    history: req.user.history,
  });
});

router.post("/register", (req, res) => {
  //회원 가입 할 때 필요한 정보를 client 에서 가져오면 그것을 데이터베이스에 넣어준다.

  const user = new User(req.body);

  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});
router.post("/login", (req, res) => {
  //요청된 이메일을 데이터베이스에서 있는지 찾는다
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다.",
      });
    }

    //요청된 이메일이 데이터 베이스에 있다면 비밀번호 인지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다.",
        });

      //비밀번호가 맞다면 token 생성
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        //token을 저장한다. 어디에? 쿠키 , 로컬스토리지, 세션 - > 나는 쿠키에 저장
        res
          .cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

router.get("/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true,
    });
  });
});

router.post("/addToCart", auth, (req, res) => {
  //먼저 user collection에 해당 유저(한명)의 정보를 가져오기
  User.findOne({ _id: req.user._id }, (err, userInfo) => {
    //가져온 정보에서 카트에 넣으려고 하는 상품이 카트안에 이미 있는지 확인
    let duplicate = false;

    userInfo.cart.forEach((item) => {
      if (item.id === req.body.todoId) {
        duplicate = true;
      }
    });
    //상품이 이미 있으면 상품 개수 하나 올리기
    if (duplicate) {
      User.findOneAndUpdate(
        { _id: req.user._id, "cart.id": req.body.todoId },
        { $inc: { "cart.$.quantity": 1 } },
        { new: true },
        (err, userInfo) => {
          if (err) return res.status(400).json({ success: false, err });
          return res.status(200).send(userInfo.cart);
        }
      );
    }
    //카트안에 이미 있지 않으면
    else {
      //필요한 상품 정보, id, 개수 1, 날짜정보를 넣어주기
      User.findOneAndUpdate(
        { _id: req.user._id },
        {
          $push: {
            cart: {
              id: req.body.todoId,
              quantiry: 1,
              data: Date.now(),
            },
          },
        },
        { new: true },
        (err, userInfo) => {
          if (err) return res.status(400).json({ sucess: false, err });
          res.status(200).send(userInfo.cart);
        }
      );
    }
  });

  //상품이 추가된 정보를 redux에 넣기
});

module.exports = router;
