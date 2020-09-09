const { model, Schema } = require("mongoose");

const profileSchema = new Schema(
  {
    name: { type: String, required: true },
    surname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      validate: {
        validator: async function (email) {
          const user = await profileModel.find({ email: email });
          console.log(user);
          if (user.length > 0) {
            let error = new Error();
            error.message = "THIS EMAIL ALREADY EXISTS";
            throw error;
          }else return true
        },
        message: "User already exists!",
      },
     
    }, //VALIDATION
    bio: { type: String, required: true },
    title: { type: String, required: true },
    area: { type: String, required: true },
    image: { type: String, required: true, default: "www.www.www" },
    username: {
      type: String,
      required: true,
      validate: {
        validator: async function (username) {
          const user = await profileModel.find({ username: username });
          if (user.length > 0) {
            let error = new Error();
            error.message = "THIS  USERNAME already EXISTS";
            throw error;
          }else return true
        },
        message: "User already exists!",
      },
    }, //validaton
 
  },
  
  { timestamps: true }
);

profileSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.__v

  return userObject
}
const profileModel = model("profile", profileSchema);

module.exports = profileModel;
