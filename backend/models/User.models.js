import mongoose  from "mongoose";

const userSchema= new mongoose.Schema({
email:{
  type:  String,
  required:true,
  unique:true
},
password:{
  type:String,
  required:true
},
role:{ 
  type:String,
  default:"OWNER"
},
workspaces: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: "Workspace"
}]
},{timestamps:true})

const User = mongoose.model("User", userSchema);
export default User;