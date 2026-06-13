import Post from "../models/Post.js";
import { createNotification } from "../utils/createNotification.js";

//create post 
export const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;


    const post = await Post.create({
      title,
      content,
      image: req.file ? req.file.path : "", // Cloudinary URL
      author: req.user.id,
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//get all post
export const getPosts = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            {
              title: {
                $regex: req.query.search,
                $options: "i",
              },
            },
            {
              content: {
                $regex: req.query.search,
                $options: "i",
              },
            },
          ],
        }
      : {};

    const posts = await Post.find(keyword)
      .populate("author", "name email");

    res.json(posts);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//get single post
export const getPostById= async(req,res)=>{
    try{
        const post =await Post.findById(req.params.id).populate("author","name email");

        if(!post) {
            return res.status(404).json({message:"POST NOT FOUND",});
        }
        res.json(post);
    }catch(error){
        res.status(500).json({message:error.message});
    }
};

//update post
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;

    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//delete post

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (req.user.role !== "admin" && post.author.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await post.deleteOne();

    res.json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//likes
export const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }
console.log("POST ID:", post._id);
console.log("LIKES BEFORE:", post.likes);
    const userId = req.user.id;

    const alreadyLiked = post.likes.some(
  (id) => id.toString() === userId
);

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId
      );

      await post.save();
      console.log("LIKES AFTER SAVE:", post.likes);

      return res.json({
        message: "Post unliked",
        likesCount: post.likes.length, 
      });
    }
    await createNotification({
  user: post.author,
  message: "Someone liked your post",
  type: "like",
  post: post._id, 
});

console.log("User ID:", userId); 

console.log(
  "Likes Array:",
  post.likes.map(id => id.toString())
);

console.log("Already Liked:", alreadyLiked);


    post.likes.push(userId);

    await post.save();

    res.json({
      message: "Post liked",
      likesCount: post.likes.length,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//trending posts
export const getTrendingPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name profilePic")
      .sort({ createdAt: -1 });

    const trendingPosts = posts.sort(
      (a, b) => b.likes.length - a.likes.length
    );

    res.json(trendingPosts.slice(0, 10));
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
//views
export const incrementViews = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const userId = req.user.id;

    const alreadyViewed = post.viewedBy.some(
      (id) => id.toString() === userId
    );

    if (!alreadyViewed) {
      post.views += 1;
      post.viewedBy.push(userId);
      await post.save();
    }

    res.json({
      views: post.views,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

