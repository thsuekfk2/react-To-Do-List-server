const express = require("express");
const router = express.Router();
const multer = require("multer");
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

module.exports = router;
