import Workspace from "../models/Workspace.model.js"
import {
  createWorkspaceService,
  getUserworkspaceService
} from "../services/workspace.service.js"
import User from "../models/User.models.js";

/* CREATE */
/* CREATE */
export const createWorkspace = async (req, res) => {
  try {
    const workspace = await createWorkspaceService(
      req.user._id,
      req.body.name
    )
    
    // 🔥 Populate karke response bhejo
    const populatedWorkspace = await Workspace.findById(workspace._id)
      .populate("owner", "email")
      .populate("members.user", "email")
    
    res.status(201).json({
      _id: populatedWorkspace._id,
      name: populatedWorkspace.name,
      owner: populatedWorkspace.owner.email,
      members: populatedWorkspace.members.map(m => ({
        email: m.user.email,
        role: m.role
      })),
      createdAt: populatedWorkspace.createdAt,
      updatedAt: populatedWorkspace.updatedAt
    })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

/* GET */
export const getWorkspace = async (req, res) => {
  try {
    const workspaces = await getUserworkspaceService(req.user._id)
    res.status(200).json({ workspaces })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

/* UPDATE */
export const updateWorkspace = async (req, res) => {
  try {
   const { id } = req.params
    const { name } = req.body
    const userId = req.user._id

    const workspace = await Workspace.findById(id)

    if (!workspace) {
      return res.status(404).json({ msg: "Workspace not found" })
    }

    if (workspace.owner.toString() !== userId.toString()) {
      return res.status(403).json({ msg: "Not authorized" })
    }

    workspace.name = name
    await workspace.save()

    res.status(200).json(workspace)
  } catch (error) {
    console.error(error)
    res.status(500).json({ msg: "Server error" })
  }
}

/* DELETE */
export const deleteWorkspace = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user._id

    const workspace = await Workspace.findById(id)

    if (!workspace) {
      return res.status(404).json({ msg: "Workspace not found" })
    }

    if (workspace.owner.toString() !== userId.toString()) {
      return res.status(403).json({ msg: "Not authorized" })
    }

    await workspace.deleteOne()

    res.status(200).json({ msg: "Workspace deleted successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ msg: "Server error" })
  }
}
/* ADD MEMBER */
export const addMember = async (req, res) => {
  try {
    const { id } = req.params
    const { email } = req.body
    const userId = req.user._id

    if (!email) {
      return res.status(400).json({ msg: "Email is required" })
    }

    const workspace = await Workspace.findById(id)
    if (!workspace) return res.status(404).json({ msg: "Workspace not found" })

    if (workspace.owner.toString() !== userId.toString())
      return res.status(403).json({ msg: "Not authorized" })

    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ msg: "User not found" })

    // 🔥 Check if user is already owner
    if (user._id.toString() === workspace.owner.toString()) {
      return res.status(400).json({ msg: "User is already the owner" })
    }

    // 🔥 Check if already a member
    const alreadyMember = workspace.members.some(
      (member) => member.user.toString() === user._id.toString()
    )
    if (alreadyMember) return res.status(400).json({ msg: "User already a member" })

    // Add as MEMBER (not OWNER)
    workspace.members.push({ user: user._id, role: "MEMBER" })
    await workspace.save()

    // Update user's workspaces
    if (!user.workspaces.includes(workspace._id)) {
      user.workspaces.push(workspace._id)
      await user.save()
    }

    // 🔥 Fetch fresh data with populate
    const updatedWorkspace = await Workspace.findById(id)
      .populate("owner", "email")
      .populate("members.user", "email")

    res.status(200).json({
      msg: "Member added successfully",
      workspace: {
        _id: updatedWorkspace._id,
        name: updatedWorkspace.name,
        owner: updatedWorkspace.owner.email,
        members: updatedWorkspace.members.map(m => ({
          email: m.user.email,
          role: m.role
        }))
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ msg: error.message })
  }
}


