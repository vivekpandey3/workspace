
import User from "../models/User.models.js"
import Workspace from "../models/Workspace.model.js"  // ✅ correct
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const signup =async (req,res)=>{
  console.log("POSTMAN BODY:", req.body)

  try {
const {email,password,companyName }= req.body

  if (!email || !password || !companyName) {
      return res.status(400).json({ msg: "All fields are required" })
    }

const exists= await User.findOne({email})
if(exists) return res.status(400).json({msg:"User already exists"})
  const hashedPassword=  await bcrypt.hash(password,10)

// user craeate
const user= await User.create({
  email,
  password:hashedPassword
})

// workspace create
const workspace=await Workspace.create({
  name: companyName,
  owner: user._id,
  members: [user._id]})


// workspace.owner= user._id
user.workspaces.push(workspace._id)
    await user.save()

        const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    )


res.status(201).json({msg:"Signup successfull",
  token,
  user:{
    id:user._id,
    email: user.email,
    workspaces:[workspace]
  }

})

  }
  catch(error){
    res.status(500).json({error: error.message})

  }
}
 export const login =async (req,res)=>{
  try{
    const {email, password}= req.body;

    const user= await User.findOne({email}).populate("workspaces")
    if(!user) return res.status(400).json({msg:"Invalid credentials"})

      const match= await bcrypt.compare(password,user.password)

      if(!match) return res.status(400).json({msg:"invalid credentials"})

        const token= jwt.sign({
          userId: user._id,
         // workspaceId:user.workspace._id
        },
         process.env.JWT_SECRET,  
        { expiresIn:process.env.JWT_EXPIRE}
      )

      res.status(200).json({
        msg:"Login successfull",
        token,
        user:{
          id:user._id,
          email:user.email,
          workspaces:user.workspaces
        }
      })

  }
  catch(error){
    res.status(500).json({error: error.message})
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

