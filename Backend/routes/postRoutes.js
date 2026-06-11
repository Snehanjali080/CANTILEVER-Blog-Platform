import express from "express";
import {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost,
    toggleLike,
} from "../controllers/postController.js";
import { upload } from "../middleware/upload.js";
import { getTrendingPosts } from "../controllers/postController.js";

import {protect} from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { incrementViews } from "../controllers/postController.js";
const router = express.Router();

router.post("/", protect, upload.single("image"), createPost);

router.post("/:id/view", incrementViews);
router.put("/:id/view", protect, incrementViews);

router.get("/",getPosts);
router.get("/:id",getPostById);
router.put("/",protect,updatePost);
//router.delete("/",protect,deletePost);
router.post("/:id/like", protect, toggleLike);
router.put("/:id/like", protect, toggleLike);
router.delete("/:id", protect, deletePost);
router.get("/trending", getTrendingPosts);
router.get("/:id", getPostById);

export default router;