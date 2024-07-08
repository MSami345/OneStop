import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const useSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  phoneNumber: String,
  email: { type: String, unique: true },
  password: String,
  clientId: String,
  gender: {
    type: String,
    enum: ["male", "female", "other"],
  },
  profileImage: String,
  address: String,
  age: Number,
});

useSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt); // hash password
    next();
  } catch (error) {
    next(error);
  }
});

useSchema.methods.hashPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export default mongoose.model("users", useSchema);
