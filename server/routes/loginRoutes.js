import express from "express";
const router = express.Router();

import {
  LoginUser,
  logoutUser,
  registerUser,
} from "../Controllers/userControllers.js";

router.post("/register", registerUser);
router.post("/login", LoginUser);
router.get("/logout", logoutUser);

export default router;
