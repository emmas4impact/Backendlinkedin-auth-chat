const express = require("express");
const router = express.Router();
const profileModel = require("./schema");

router.get("/", async (req, res, next) => {
  try {
    let user = await profileModel.find();
    res.send(user);
  } catch (error) {
    console.log(error);
  }
});
router.get("/:id", async (req, res, next) => {
  try {
    let user = await profileModel.findById(req.params.id);
    res.send(user);
  } catch (error) {
    console.log(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const newProfile = new profileModel(req.body);
    const response = await newProfile.save();
    res.send(response);
  } catch (error) {
    res.send(error.message);
  }
});

router.put("/:id", async (req, res, next) => {
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

router.delete("/:id", async (req, res, next) => {
  try {
    const deleted = await profileModel.findByIdAndDelete(req.params.id);
    res.send(deleted);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
