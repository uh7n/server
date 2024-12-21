import mongoose from "mongoose";

const UserSchema=mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    phone:{type:String,required:false},
    password:{type:String,required:true},
    image:{type:String,required:true}
});

const UserModel=mongoose.model("Users",UserSchema,"Users");

export default UserModel;
