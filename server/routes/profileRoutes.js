import {
  getUserProfile,
  updateUserProfile,
} from "../Controllers/ProfileControllers.js";
import express from "express";
import auth from "../middleware/auth.js";
const router = express.Router();

router.get("/profile/:id", auth, getUserProfile);
router.put("/profile/:id", auth, updateUserProfile);


export default router;
