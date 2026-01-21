import express from "express"
import { authMiddleware } from "../middleware/auth.middleware.js"

import {getWorkspace, createWorkspace, deleteWorkspace, updateWorkspace,addMember} from "../controllers/workspace.controller.js"



const router = express.Router()

router.post("/",authMiddleware,createWorkspace)
router.get("/", authMiddleware,getWorkspace)

router.put("/:id",authMiddleware,updateWorkspace)
router.delete("/:id", authMiddleware,deleteWorkspace)
router.post("/:id/add-member", authMiddleware, addMember);


export default router