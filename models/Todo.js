const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const todoSchema = mongoose.Schema(
  {
    writer: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      maxlength: 50,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      default: 0,
    },
    images: {
      type: Array,
      default: [],
    },
    sold: {
      type: Number,
      maxlength: 100,
      default: 0,
    },
    period: {
      type: Number,
      default: 1,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
  //자동으로 등록시간 업데이트가 기록됨
);

//키워드가 어디에 더 중점적인지
todoSchema.index(
  {
    title: "text",
    description: "text",
  },
  {
    weight: {
      title: 5,
      description: 1,
    },
  }
);

const Todo = mongoose.model("Todo", todoSchema);
module.exports = { Todo };
