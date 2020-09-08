const express = require("express");
const { authenticate } = require("../../auth/index")
const router = express.Router();
const profileModel = require("./schema");
const { authorize } = require("../../auth/middleware")

router.post("/register", async (req, res, next) => {
  try {
    const newUser = new profileModel(req.body);
    const { _id } = await newUser.save();

    res.status(201).send(_id);
  } catch (error) {
    next(error)
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await profileModel.findByCredentials(email, password);
    //console.log(req.body);
    const tokens = await authenticate(user);
    res.send(tokens);
  } catch (error) {
    next(error);
  }
})

router.get("/", authorize, async (req, res, next) => {
  try {
    let user = await profileModel.find();
    res.send(user);
  } catch (error) {
    console.log(error);
  }
});
router.get("/:id", authorize, async (req, res, next) => {
  try {
    let user = await profileModel.findById(req.params.id);
    res.send(user);
  } catch (error) {
    console.log(error);
  }
});

router.post("/", authorize, async (req, res, next) => {
  try {
    const newProfile = new profileModel(req.body);
    const response = await newProfile.save();
    res.send(response);
  } catch (error) {
    res.send(error.message);
  }
});

router.put("/:id", authorize, async (req, res, next) => {
  try {
    const editprofile = await profileModel.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    const edited = await profileModel.findById(req.params.id);
    res.send(edited);
  } catch (error) {
    console.log(error);
  }
});

router.delete("/:id", authorize, async (req, res, next) => {
  try {
    const deleted = await profileModel.findByIdAndDelete(req.params.id);
    res.send(deleted);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
