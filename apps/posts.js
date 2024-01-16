import { Router } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";

const postRounter = Router();

postRounter.get("/", async (req, res) => {
  const collection = db.collection("BlogData");
  const postData = await collection.find({}).toArray();
  return res.json({ data: postData });
});

postRounter.get("/:postId", async (req, res) => {
  const collection = db.collection("BlogData");
  const postId = new ObjectId(req.params.postId);

  const postData = await collection.findOne({ _id: postId });
  return res.json(postData);
});

postRounter.post("/", async (req, res) => {
  const collection = db.collection("BlogData");
  const inputPost = { ...req.body };

  await collection.insertOne(inputPost);

  return res.json({ message: "posts has been added successfully" });
});

postRounter.put("/:postId", async (req, res) => {
  const collection = db.collection("BlogData");
  const postId = new ObjectId(req.params.postId);

  const inputPost = { ...req.body };

  let filterPost = {};

  if (inputPost.topic) {
    filterPost = { topic: inputPost.topic };
  }

  if (inputPost.description) {
    filterPost = { description: inputPost.description };
  }

  await collection.updateOne(
    {
      _id: postId,
    },
    {
      $set: filterPost,
    }
  );

  return res.json({ message: "post has been updated successfully" });
});

postRounter.delete("/:postId", async (req, res) => {
  const collection = db.collection("BlogData");
  const postId = new ObjectId(req.params.postId);

  const postData = await collection.deleteOne({ _id: postId });
  return res.json({ message: "post has been deleted " });
});

export default postRounter;
