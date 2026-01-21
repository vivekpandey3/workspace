import mongoose from "mongoose"

const workspaceSchema= new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },
  members:[{
    user:{
    
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
      required: true,
  },
role:{
  type:String,
  enum:["OWNER","MEMBER"],
  default:"MEMBER"
},
  }
],
},{timestamps:true})

const Workspace = mongoose.model("Workspace", workspaceSchema);
export default Workspace;