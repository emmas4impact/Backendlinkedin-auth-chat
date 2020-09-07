const express = require("express");

const router = express.Router();

const postModel = require("./schema");

router.get("/", async (req, res, next) => {
  try {
    const posts = await postModel.find();
    res.send(posts);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const post = await postModel.findById(req.params.id);
    res.send(post);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const newPost = new postModel(req.body);
    await newPost.save();
    res.send("Created");
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const editPost = await postModel.findByIdAndUpdate(req.params.id, req.body);
    await postModel.findById(req.params.id);
    res.send("Updated");
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await postModel.findByIdAndDelete(req.params.id);
    res.send("Deleted");
  } catch (error) {}
});

module.exports = router;
