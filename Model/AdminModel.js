import mongoose from "mongoose";

const AdminSchema=mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
});

const AdminModel=mongoose.model("Admins",AdminSchema,"Admins");

export default AdminModel;

