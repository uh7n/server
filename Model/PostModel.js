import mongoose from "mongoose";

const PostsSchema=mongoose.Schema({
    postMsg:{type:String,required:true},
    email:{type:String,required:true},
    rating:{type:String,required:true},    
},
{timestamps:{createdAt:true,updatedAt:false}}
);

const PostsModel=mongoose.model("Posts",PostsSchema,"Posts");

export default PostsModel;

