import * as dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import loginRoutes from "./routes/loginRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import cookieSession from "cookie-session";
import session from "express-session";
import auth from "./middleware/auth.js";
import bodyParser from "body-parser";
import { validateJWT } from "./Utils/tokenUtils.js";
import googleAuthRoutes from "./routes/googleAuthRoutes.js";

dotenv.config();

const app = express();
app.use(
  cookieSession({
    name: "session",
    keys: ["Secret"],
    maxAge: 24 * 60 * 60 * 1000,
  })
);
app.use(
  session({
    secret: "JWT123",
    saveUninitialized: false,
    resave: false,
  })
);
app.use(bodyParser.urlencoded({ extended: false }));

const corsOptions = {
  origin: process.env.Cors_URL,
  credentials: true,
};

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use("/api/auth", loginRoutes);
app.use("/api/v1", profileRoutes);
app.use("/api/google", googleAuthRoutes);

const port = process.env.PORT || 5200;

try {
  await mongoose.connect(process.env.URL);
  console.log("connected to the database");
  app.listen(port, () => {
    console.log(`server is listening at port ${port}`);
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}

app.get("/check", auth, (req, res, next) => {
  res.send(req.cookies.jwToken);
});

app.get("/verifyUser", async (req, res) => {
  const token = req.cookies.jwToken;
  if (!token) {
    return res.status(401).json("No token provided! Please Login again");
  }

  try {
    const isValid = await validateJWT(token);

    if (isValid) {
      return res.status(200).json({ msg: "valid user" });
    } else {
      if (isValid === "jwt expired") {
        return;
        res.status(401).json("Token expired! Please Login again");
      } else {
        return;
        res.status(401).json("Token verification failed! Please Login again");
      }
    }
  } catch (err) {
    console.log("Error: " + err);
    res.status(500).json({ error: err });
  }
});
