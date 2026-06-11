import User from "../models/User.js";
import Post from "../models/Post.js";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password");
    const totalPosts=await Post.countDocuments({
        author: req.user.id,
    });

    res.json({user,totalPosts,});
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      author: req.user.id,
    });

    res.json(posts);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.name = req.body.name || user.name;

    if (req.file) {
      user.profilePic = req.file.path;
    }

    await user.save();

    res.json({
      message: "Profile updated",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const toggleBookmark = async (req, res) => {
  try {
    const user = req.user;
    const postId = req.params.postId;

    const alreadyBookmarked = user.bookmarks.includes(postId);

    if (alreadyBookmarked) {
      user.bookmarks = user.bookmarks.filter(
        (id) => id.toString() !== postId
      );

      await user.save();

      return res.json({
        message: "Bookmark removed",
      });
    }

    user.bookmarks.push(postId);

    await user.save();

    res.json({
      message: "Post bookmarked",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getBookmarks = async (req, res) => {
  try {
    const user = await req.user.populate({
      path: "bookmarks",
      populate: {
        path: "author",
        select: "name profilePic",
      },
    });

    res.json(user.bookmarks);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
