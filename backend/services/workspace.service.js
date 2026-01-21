import Workspace from "../models/Workspace.model.js"
 import User from "../models/User.models.js"

 export const createWorkspaceService = async (userId, name)=>{
  const workspace= await Workspace.create({
  name,
  owner: userId,
  members:[{ user: userId, role: "OWNER" }] ,
 })
 await User.findByIdAndUpdate(userId,{
  $push:{workspaces: workspace._id}
 })
 return workspace;
}

export const getUserworkspaceService = async (userId) => {
  const user = await User.findById(userId).populate({
    path:"workspaces",
    select:"_id name owner members createdAt updatedAt",
    populate: [
      { path: "members", select: "email" },  // members populate
      { path: "owner", select: "email" }     // 🔥 owner populate added
    ]
  })
  if (!user) return []
  return user.workspaces
}



