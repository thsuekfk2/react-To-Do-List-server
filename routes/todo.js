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
  let limit = req.body.limit ? parseInt(req.body.limit) : 0;
  let skip = req.body.limit ? parseInt(req.body.skip) : 0;
  let term = req.body.searchTerm;

  let findArgs = {};
  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === "price") {
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          //gte 이것보다 크거나 같고 (Greater than equal)
          $lte: req.body.filters[key][1],
          //gte 이것보다 작거나 같은 (Less than equal)
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  console.log("findArgs", findArgs);

  if (term) {
    //todo collection 에 들어있는 모든 todo를 가져오기
    Todo.find(findArgs) //모든 정보를 찾는다.
      .find({ $text: { $search: term } })
      //writer이 유니크 아이디가 아닌 사용자의 정보가 필요하다
      .skip(skip)
      .limit(limit)
      .populate("writer") // 이 유니크 아이디를 이용하여 writer에 대한 모든 정보를 가져올 수 있다.
      .exec((err, todoInfo) => {
        //쿼리를 돌리면 된다. 에러나 정보가 들어가 있다.
        if (err) return res.status(400).json({ success: false, err });
        return res
          .status(200)
          .json({ success: true, todoInfo, postSize: todoInfo.length });
      });
  } else {
    //todo collection 에 들어있는 모든 todo를 가져오기
    Todo.find(findArgs) //모든 정보를 찾는다.
      //writer이 유니크 아이디가 아닌 사용자의 정보가 필요하다
      .skip(skip)
      .limit(limit)
      .populate("writer") // 이 유니크 아이디를 이용하여 writer에 대한 모든 정보를 가져올 수 있다.
      .exec((err, todoInfo) => {
        //쿼리를 돌리면 된다. 에러나 정보가 들어가 있다.
        if (err) return res.status(400).json({ success: false, err });
        return res
          .status(200)
          .json({ success: true, todoInfo, postSize: todoInfo.length });
      });
  }
});

router.get("/todo_by_id", (req, res) => {
  //productId를 이용해서 DB에서 productId와 같은 상품의 정보를 가져온다
  let type = req.query.type;
  let todoId = req.query.id;

  if (type == "array") {
    let ids = req.query.id.split(",");
    todoId = ids;
  }
  Todo.find({ _id: { $in: todoId } })
    .populate("writer")
    .exec((err, todo) => {
      if (err) return res.status(400).send(err);
      return res.status(200).json({ success: true, todo });
    });
});

module.exports = router;
