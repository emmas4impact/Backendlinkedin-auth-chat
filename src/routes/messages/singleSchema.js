const { Schema } = require("mongoose")
const mongoose = require("mongoose")

const singleSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    sender: {type:  Schema.Types.ObjectId, ref: "profile", required: true,},
    receiver: {type:  Schema.Types.ObjectId, ref: "profile", required: true,}
  },
  { timestamps: true }
)


const SingleModel = mongoose.model("singleChat", singleSchema)

singleSchema.statics.findAndPopulate = async (receiver, sender) => {
    const message = await SingleModel
      .find({
        $or: [
          { from, sender },
          { receiver: sender, sender: receiver },
        ],
      })
      .populate("sender", ["name", "surname", "_id"])
      .populate("receiver", ["name", "surname", "_id"]);
    return message;
  };

module.exports = SingleModel
