import express from "express";
import cors from "cors";
import { client } from "./utils/db.js";
import postRounter from "./apps/posts.js";
import commentRounter from "./apps/comments.js";

async function init() {
  await client.connect();


  const app = express();
  const port = 4000;

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));



  app.use("/posts", postRounter);
  app.use("/posts", commentRounter);


  app.get("/", (req, res) => {
    return res.json("Hello Skill Checkpoint #2");
  });

  app.get("*", (req, res) => {
    return res.status(404).json("Not found");
  });

  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}

init();
