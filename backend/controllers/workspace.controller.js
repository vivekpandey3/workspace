import Workspace from "../models/Workspace.model.js"
import {
  createWorkspaceService,
  getUserworkspaceService
} from "../services/workspace.service.js"
import User from "../models/User.models.js";

/* CREATE */
export const createWorkspace = async (req, res) => {
  try {
    const workspace = await createWorkspaceService(
      req.user._id,
      req.body.name
    )
    res.status(201).json(workspace)
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
    const { id } = req.params;        // ✅ match route
    const { email } = req.body;
    const userId = req.user._id;

    const workspace = await Workspace.findById(id);
    if (!workspace) return res.status(404).json({ msg: "Workspace not found" });

    if (workspace.owner.toString() !== userId.toString()) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (workspace.members.includes(user._id)) {
      return res.status(400).json({ msg: "User already a member" });
    }

    workspace.members.push(user._id);
    await workspace.save();

    // optional: add workspace to user's list
    if (!user.workspaces.includes(workspace._id)) {
      user.workspaces.push(workspace._id);
      await user.save();
    }

    res.status(200).json({ msg: "Member added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Failed to add member" });
  }
};
