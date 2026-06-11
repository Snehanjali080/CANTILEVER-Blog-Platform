import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/token.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      user:{
        id: user._id,
        name:user.name,
        email:user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const loginUser = async(req,res)=>{
    try{
        const {email,password}=req.body;

        //check user
        const user =await User.findOne({email});

        if(!user){
            return res.status(400).json({
                message:"Invalid email or password",
            });
        }

        //compare password
        const isMatch =await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({
                message: "Invalid email or password",
            });
        }
        const token = jwt.sign(
  {
    id: user._id,
    role: user.role,
  },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);

        res.status(200).json({
            message:"Login succesful",
            token,
            user:{ 
                id:user._id,
                name:user.name,
                email:user.email,
            },
        });
    }catch(error){
        res.status(500).json({ 
            message:error.message,
        }); 
    }
}; 