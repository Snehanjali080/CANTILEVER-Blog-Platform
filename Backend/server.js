

import dotenv from "dotenv";
dotenv.config(); 

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import { errorHandler } from "./utils/errorHandler.js";
import { logger } from "./middleware/authMiddleware.js";
import commentRoutes from "./routes/commentRoutes.js";
import userRoutes from "./routes/userRouter.js";
import "./config/cloudinary.js";
import adminRoutes from "./routes/adminRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
dotenv.config(); 
connectDB();

const app = express(); 

app.use(cors());
app.use(express.json());
app.use(errorHandler);
app.use(logger);
 
app.use("/api/auth",authRouter);
app.use("/api/posts",postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

app.get("/",(req,res)=>{
    res.send("Blog API Running");
}); 

app.use("/api/notifications", notificationRoutes);

const PORT =process.env.PORT ||5000;
app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`);
}) ;
