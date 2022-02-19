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

module.exports = router;
