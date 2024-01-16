import { Router } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";

const postRounter = Router();

postRounter.get("/", async (req, res) => {
  const collection = db.collection("BlogData");

  const searchList = {};

  if (req.query.category) {
    searchList["category"] = new RegExp(req.query.category, "i");
  }

  if (req.query.topic) {
    searchList["topic"] = new RegExp(req.query.topic, "i");
  }

  console.log(searchList);

  const postData = await collection.find(searchList).toArray();
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

  await collection.insertOne({ ...inputPost, like: 0 });

  return res.json({ message: "posts has been added successfully" });
});

postRounter.put("/:postId", async (req, res) => {
  const collection = db.collection("BlogData");
  const postId = new ObjectId(req.params.postId);

  const inputPost = { ...req.body };
  let addLike = 0;

  let filterPost = {};

  if (inputPost.topic) {
    filterPost = { topic: inputPost.topic };
  }

  if (inputPost.description) {
    filterPost = { description: inputPost.description };
  }

  if (req.query.like) {
    addLike = Number(req.query.like);
  }

  await collection.updateOne(
    {
      _id: postId,
    },

    {
      $set: filterPost,
    }
  );

  await collection.updateOne(
    {
      _id: postId,
    },
    {
      $inc: { like: addLike },
    }
  );

  return res.json({ message: "post has been updated successfully" });
});

postRounter.delete("/:postId", async (req, res) => {
  const collection = db.collection("BlogData");
  const collectionComment = db.collection("CommentData");

  const postId = new ObjectId(req.params.postId);

  await collection.deleteOne({ _id: postId });
  await collectionComment.deleteMany({ topicId: postId });

  return res.json({ message: "post has been deleted " });
});

export default postRounter;
