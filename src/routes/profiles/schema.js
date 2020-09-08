const { model, Schema } = require("mongoose");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const validate = require("validator")

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
          } else return true
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
          } else return true
        },
        message: "User already exists!",
      },
    }, //validaton
    password: {
      type: String,
      required: true,
      minlength: 7,
    },
  },
  { timestamps: true }
);

profileSchema.statics.findByCredentials = async (email, password) => {
  const user = await profileModel.findOne({ email });
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const err = new Error("Unable to login");
    err.httpStatusCode = 401;
    throw err;
  }
  return user;
};

profileSchema.pre("save", async function (next) {
  const user = this
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});
profileSchema.post("validate", function (error, doc, next) {
  if (error) {
    error.httpStatusCode = 400;
    next(error);
  } else {
    next();
  }
});

profileSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoError" && error.code === 11000) {
    error.httpStatusCode = 400;
    next(error);
  } else {
    next();
  }
});



const profileModel = model("profiles", profileSchema);

module.exports = profileModel;
