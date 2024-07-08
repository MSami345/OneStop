import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

export const createJWT = (payload) => {
  const token = jwt.sign({ ...payload }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
  return token;
};

export const validateJWT = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error("Token verification failed:", err.message);
        reject(err.message);
      } else {
        resolve(true, { message: "verified" });
      }
    });
  });
};
