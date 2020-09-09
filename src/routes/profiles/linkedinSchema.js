const { model, Schema } = require("mongoose");
const bcrypt = require("bcryptjs");

const linkedinSchema = new Schema(
    {
        name: { type: String, required: true },
        surname: {
          type: String,
          required: true,
        },
        displayName: {
            type: String,
            required: true,
          },
        image: {
            type: String,
            required: true,
          },
          email: {
            type: String,
            required: true,
          },
          LinkedinId: {
            type: String,
            required: true,
          },
          
    })

const LinkedinModel = model("Linkedin", linkedinSchema);

module.exports = LinkedinModel;