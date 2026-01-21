
import User from "../models/User.models.js"
import Workspace from "../models/Workspace.model.js"  // 
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const signup = async (req, res) => {
  console.log("POSTMAN BODY:", req.body)

  try {
    const { email, password, companyName } = req.body

    if (!email || !password || !companyName) {
      return res.status(400).json({ msg: "All fields are required" })
    }

    const exists = await User.findOne({ email })
    if (exists) return res.status(400).json({ msg: "User already exists" })
    
    const hashedPassword = await bcrypt.hash(password, 10)

    // user create
    const user = await User.create({
      email,
      password: hashedPassword,
      workspaces: []
    })

    // workspace create
    const workspace = await Workspace.create({
      name: companyName,
      owner: user._id,
      members: [
        {
          user: user._id,
          role: "OWNER"
        }
      ]
    })

    user.workspaces.push(workspace._id)
    await user.save()

    // 🔥 Populate workspace before sending response
    await workspace.populate("owner", "email")
    await workspace.populate("members.user", "email")

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    )

    res.status(201).json({
      msg: "Signup successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        workspaces: [{
          _id: workspace._id,
          name: workspace.name,
          owner: workspace.owner.email,  // 🔥 Email show hoga
          members: workspace.members.map(m => ({
            email: m.user.email,
            role: m.role
          })),
          createdAt: workspace.createdAt,
          updatedAt: workspace.updatedAt
        }]
      }
    })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email }).populate({
      path: "workspaces",
      populate: [
        { path: "owner", select: "email" },
        { path: "members.user", select: "email" }
      ]
    })
    
    if (!user) return res.status(400).json({ msg: "Invalid credentials" })

    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(400).json({ msg: "Invalid credentials" })

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    )

    res.status(200).json({
      msg: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        workspaces: user.workspaces.map(ws => ({
          _id: ws._id,
          name: ws.name,
          owner: ws.owner?.email || "N/A",  // 🔥 Email show hoga
          members: ws.members.map(m => ({
            email: m.user?.email || "Unknown",
            role: m.role
          })),
          createdAt: ws.createdAt,
          updatedAt: ws.updatedAt
        }))
      }
    })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

 export const updateWorkspace = async (req, res) => {
  try {
    const { id } = req.params
    const { name } = req.body
    const userId = req.user.id   // authMiddleware se aa raha

    const workspace = await Workspace.findById(id)

    if (!workspace) {
      return res.status(404).json({ msg: "Workspace not found" })
    }

    // 🔐 Only owner can edit
    if (workspace.owner.toString() !== userId) {
      return res.status(403).json({ msg: "Not authorized" })
    }

    workspace.name = name
    await workspace.save()

    res.json(workspace)
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: "Server error" })
  }
}

export const deleteWorkspace = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const workspace = await Workspace.findById(id)

    if (!workspace) {
      return res.status(404).json({ msg: "Workspace not found" })
    }

    // 🔐 Only owner can delete
    if (workspace.owner.toString() !== userId) {
      return res.status(403).json({ msg: "Not authorized" })
    }

    await workspace.deleteOne()

    res.json({ msg: "Workspace deleted successfully" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: "Server error" })
  }
}

