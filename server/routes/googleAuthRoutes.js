import express from "express";
import UserModel from "../Models/UserModel.js";
import { createJWT } from "../Utils/tokenUtils.js";

const router = express.Router();

router.post("/googleLogin", async (req, res) => {
  const { email, firstName, lastName, profileImage, clientId } = req.body;

  try {
    // Check if the user with this email already exists
    let user = await UserModel.findOne({ email });

    if (user) {
      const jwtToken = createJWT({
        id: user._id,
        name: user.firstName,
        email: user.email,
      });

      res.cookie("jwToken", jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.cookie(
        "user",
        { user },
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Strict",
          maxAge: 24 * 60 * 60 * 1000,
        }
      );

      req.session.token = jwtToken;
      res.status(200).json({ msg: "Login successful", jwtToken, user });
    } else {
      // User does not exist, create a new user
      user = new UserModel({
        email,
        firstName,
        lastName,
        profileImage,
        clientId,
      });

      const result = await user.save();

      const jwtToken = createJWT({
        id: result._id,
        name: result.firstName,
        email: result.email,
      });

      res.cookie("jwToken", jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.cookie(
        "user",
        { result },
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Strict",
          maxAge: 24 * 60 * 60 * 1000,
        }
      );

      req.session.token = jwtToken;

      res.status(201).json({ msg: "Login successful", jwtToken, user: result });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
