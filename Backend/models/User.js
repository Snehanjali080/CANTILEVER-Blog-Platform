import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Username is required"],
        unique:true,
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        lowercase: true
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        minlength: [6, 'Password must be at least 6 characters'],
        select:    false,
    },  
    profilePic:{
        type: String,
        default:"",
    },
    role: {
  type: String,
  enum: ["user", "admin"],
  default: "user",
   },
   
   bookmarks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
},
{timestamps: true}
);
const User = mongoose.model("User",userSchema);
export default User; 