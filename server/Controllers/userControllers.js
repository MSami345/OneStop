import UserModel from "../Models/UserModel.js";
import bcrypt from "bcryptjs";
import { createJWT } from "../Utils/tokenUtils.js";

const registerUser = async (req, res) => {
  try {
    let user = await UserModel.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    } else {
      const newUser = new UserModel(req.body);
      await newUser.save();
      res.status(201).send({ message: "Account Registered Successfully" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error", error });
  }
};

const LoginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User does not exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

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
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error" });
  }
};

const logoutUser = async (req, res) => {
  res.clearCookie("jwToken");
  res.clearCookie("user");

  req.session = null;
  res.status(200).json({ message: "Logged out successfully" });
};

export { registerUser, LoginUser, logoutUser };
