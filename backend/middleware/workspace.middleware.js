import Workspace from "../models/Workspace.model.js";

export const workspaceMiddleware = async (req,res,next)=>{
  const workspaceId =req.params.id
    // ✅ debug

  if(!workspaceId) return res.status(400).json({
    msg:"No workspace"
  })

  const isMember = await Workspace.exists({
_id: workspaceId,
members:req.user._id,
  })
  if(!isMember) return res(404).json({
    msg:"Acess denied"
  })
  req.workspaceId=workspaceId
  next()
}