const express = require("express");
const router = express.Router();
const multer = require("multer");
const { Todo } = require("../models/Todo");
//================================
//             Todo
//================================

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //destination : 어디에 파일이 저장되는지
    cb(null, "uploads/"); //루트에 있는 uploads폴더안에 파일이 저장
  },
  filename: function (req, file, cb) {
    //저장 할 때 어떤 이름으로 저장할 지
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

var upload = multer({ storage: storage }).single("file");

router.post("/image", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.json({
        success: false,
        err,
      });
    }
    return res.json({
      success: true,
      filePath: res.req.file.path,
      fileName: res.req.file.filename,
    });
  });
});

router.post("/", (req, res) => {
  //받아온 정보들을 db에 넣어준다.
  const todo = new Todo(req.body);
  todo.save((err) => {
    if (err) return res.status(400).json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

router.post("/todos", (req, res) => {
  //todo collection 에 들어있는 모든 todo를 가져오기
  Todo.find() //모든 정보를 찾는다.
    //writer이 유니크 아이디가 아닌 사용자의 정보가 필요하다
    .populate("writer") // 이 유니크 아이디를 이용하여 writer에 대한 모든 정보를 가져올 수 있다.
    .exec((err, todoInfo) => {
      //쿼리를 돌리면 된다. 에러나 정보가 들어가 있다.
      if (err) return res.status(400).json({ success: false, err });
      return res.status(200).json({ success: true, todoInfo });
    });
});

module.exports = router;
