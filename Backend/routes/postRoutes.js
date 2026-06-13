import express from "express";
import {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost,
    toggleLike, getTrendingPosts,incrementViews
} from "../controllers/postController.js";
import { upload } from "../middleware/upload.js";
import {protect} from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
const router = express.Router();


router.get("/posts/trending", getTrendingPosts);

router.get("/",getPosts);
router.post("/", protect, upload.single("image"), createPost);
router.get("/:id",getPostById);
router.put("/:id",protect,updatePost);
router.delete("/:id", protect, deletePost);
router.put("/:id/like", protect, toggleLike); 

router.put("/:id/view", protect, incrementViews);

export default router;