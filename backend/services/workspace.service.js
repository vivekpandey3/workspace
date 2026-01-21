import Workspace from "../models/Workspace.model.js"
import User from "../models/User.models.js"

export const createWorkspaceService = async (userId, name) => {
  const workspace = await Workspace.create({
    name,
    owner: userId,
    members: [{ user: userId, role: "OWNER" }]
  })
  
  await User.findByIdAndUpdate(userId, {
    $push: { workspaces: workspace._id }
  })
  
  return workspace
}

export const getUserworkspaceService = async (userId) => {
  const user = await User.findById(userId).populate({
    path: "workspaces",
    select: "_id name owner members createdAt updatedAt",
    populate: [
      { path: "owner", select: "email" },
      { path: "members.user", select: "email" }
    ]
  })
  
  if (!user) return []
  
  // 🔥 IMPORTANT: Format response properly
  return user.workspaces.map(ws => ({
    _id: ws._id,
    name: ws.name,
    owner: ws.owner?.email || "N/A",
    members: ws.members.map(m => ({
      email: m.user?.email || "Unknown",
      role: m.role
    })),
    createdAt: ws.createdAt,
    updatedAt: ws.updatedAt
  }))
}