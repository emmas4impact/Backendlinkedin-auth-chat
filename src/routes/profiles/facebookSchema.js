const { model, Schema } = require("mongoose");
const bcrypt = require("bcryptjs");

const faceBookSchema = new Schema(
    {
        facebookId: {
          type: String,
          required: true,
        },
        firstName: { type: String, required: true },
        lastName: {
          type: String,
          required: true,
        },
        fullName: {
            type: String,
            required: true,
          }
    })

const facebookModel = model("facebook", faceBookSchema);

module.exports = facebookModel;