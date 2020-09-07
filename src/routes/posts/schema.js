const { model, Schema } = require("mongoose");

const postSchema = new Schema(
  {
    text: { type: String },
    username: { type: String },
    user: { type: Schema.Types.ObjectId, ref: "profile", required: true },
    image: { type: String, default: "www.www.www" },
  },
  { timestamps: true }
);

const postModel = model("posts", postSchema);

module.exports = postModel;
