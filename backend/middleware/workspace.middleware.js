import Workspace from "../models/Workspace.model.js"

export const workspaceMiddleware = async (req, res, next) => {
  try {
    const workspaceId = req.params.id

    if (!workspaceId) {
      return res.status(400).json({ msg: "No workspace provided" })
    }

    const workspace = await Workspace.findOne({
      _id: workspaceId,
      "members.user": req.user._id   // ✅ CORRECT CHECK
    })

    if (!workspace) {
      return res.status(403).json({ msg: "Access denied" })
    }

    req.workspaceId = workspaceId
    next()
  } catch (error) {
    console.error(error)
    res.status(500).json({ msg: "Workspace access check failed" })
  }
}
