import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true,"Title required"],
    },

    content: {
      type: String,
      required: [true,"content required"],
    },

    image: {
      type: String,
      default: "",
    },
    
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    viewedBy: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
],
  },
  { timestamps: true }

);

const Post = mongoose.model("Post", postSchema);

export default Post;