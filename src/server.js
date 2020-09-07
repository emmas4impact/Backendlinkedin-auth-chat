const express = require("express");
const listEndpoints = require("express-list-endpoints");
const profileRouter = require("./routes/profiles");
const postRouter = require("./routes/posts");
const experienceRouter = require("./routes/experiences");
const { join } = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const server = express();

//server.use(express.static(join(__dirname, `../public`)))
const port = process.env.PORT;
server.use(cors());
server.use(express.json());
server.use("/profile", profileRouter);
server.use("/post", postRouter);
server.use("/experience", experienceRouter);
console.log(listEndpoints(server));

mongoose
  .connect(
    `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@linkedin.7anhn.mongodb.net/linkedin-back?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(
    server.listen(port, () => {
      console.log("Running on port", port);
    })
  )
  .catch((err) => console.log(err));
