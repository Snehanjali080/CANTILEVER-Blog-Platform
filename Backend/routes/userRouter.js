import express from "express";
import {
  getProfile,
  updateProfile,
  getUserPosts,
} from "../controllers/userController.js";

import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";
import { toggleBookmark,getBookmarks } from "../controllers/userController.js";

const router = express.Router();

router.get("/profile", protect, getProfile);

router.put(
  "/profile",
  protect,
  upload.single("profilePic"),
  updateProfile
);

router.get("/my-posts", protect, getUserPosts);

router.post(
  "/bookmark/:postId",
  protect,
  toggleBookmark
);

router.get(
  "/bookmarks",
  protect,
  getBookmarks
);
export default router;