import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

export const addComment = async(req,res)=>{
    try{
        const {text}=req.body;

        const comment=await Comment.create({
            text,
            post:req.params.postId,
            user:req.user.id,
        });
        await createNotification({
  user: post.author,
  message: "Someone commented on your post",
  type: "comment",
  post: post._id,
});
        res.status(201).json(comment);
    }catch(error){
        res.status(500).json({message:error.message});
    }
};

export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({
      post: req.params.postId,
    }).populate("user", "name");

    res.json(comments);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await comment.deleteOne();

    res.json({
      message: "Comment deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
