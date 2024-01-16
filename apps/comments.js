import { Router, json } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";

const commentRounter = Router();

commentRounter.get("/:postId/comments", async (req, res) => {
  const collection = db.collection("CommentData");

  const postId = new ObjectId(req.params.postId);

  const commentData = await collection.find({ topicId: postId }).toArray();

  return res.json({ commentData });
});

commentRounter.post("/:postId/comments", async (req, res) => {
  const collection = db.collection("CommentData");

  const postId = new ObjectId(req.params.postId);
  const inputData = { ...req.body };

  await collection.insertOne({ topicId: postId, ...inputData , like: 0});

  return res.json({ message: "updated successfully" });
});

commentRounter.put("/:postId/comments/:commentId", async (req, res) => {
  const collection = db.collection("CommentData");

  const commentId = new ObjectId(req.params.commentId);
  let addLike = 0;

  if(req.query.like)
  {
  addLike = Number(req.query.like);
  }

  await collection.updateOne(
    {
      _id: commentId,
    },
    {
      $inc: {like : addLike},
    }
  );

  return res.json({ message: "updated successfully" });
});

export default commentRounter;
