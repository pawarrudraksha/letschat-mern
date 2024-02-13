import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { accessChat,addToGroup,createGroupChat,fetchChats, removeFromGroup, renameGroup} from "../controllers/chat.controller.js";

const router=express.Router()
router.route("/").post(protect,accessChat)
router.route("/").get(protect,fetchChats)
router.route("/group").post(protect,createGroupChat)
router.route("/rename").put(protect,renameGroup)
router.route("/groupRemove").put(protect,removeFromGroup)
router.route("/groupadd").put(protect,addToGroup)
export default router;