import { validateJWT } from "../Utils/tokenUtils.js";

const auth = async (req, res, next) => {
  const token = req.cookies.jwToken;
  //   console.log(token)
  if (!token) {
    // console.log("token")
    return res.status(401).json("No token provided! Please Login again");
  }

  try {
    const isValid = await validateJWT(token);

    if (isValid) {
      next();
    } else {
      if (isValid === "jwt expired") {
        console.log("Token expired! Please Login again");
        return;
        res.status(401).json("Token expired! Please Login again");
      } else {
        console.log("Token expired! Please Login again");
        return;
        res.status(401).json("Token verification failed! Please Login again");
      }
    }
  } catch (err) {
    console.log("Error: " + err);
    res.status(500).json({ error: err });
  }
};

export default auth;
