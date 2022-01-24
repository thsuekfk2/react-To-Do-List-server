const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    maxlength: 10,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    //토큰 유효기간
    type: Number,
  },
});

//user 모델에 정보를 저장하기 전에 함수 수행
userSchema.pre("save", function (next) {
  var user = this;

  //password를 변경시킬 때만 암호화를 해준다!
  if (user.isModified("password")) {
    //비밀번호를 암호화 시킨다.
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);

      //myPlaintextPassword = user.password : 실제 비밀번호
      //hash : 암호화된 비밀번호
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    //다른것을 바꿀때는 그냥 next
    next();
  }
});

const User = mongoose.model("User", userSchema);
module.exports = { User };
