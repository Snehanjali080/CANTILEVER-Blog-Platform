import express from "express";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
export const getStats = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const totalPosts = await Post.countDocuments();
    const totalComments = await Comment.countDocuments();
    const posts = await Post.find();

const totalLikes = posts.reduce(
  (sum, post) => sum + post.likes.length,
  0
);
    res.json({ 
      totalUsers: users,
      totalPosts: totalPosts,
      totalComments: totalComments,
      totalLikes:totalLikes,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};