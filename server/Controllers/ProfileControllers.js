import UserModel from "../Models/UserModel.js";

const getUserProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log("Error: " + error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      address,
      phoneNumber,
      gender,
      age,
      profileImage,
    } = req.body;

    const user = await UserModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.address = address || user.address;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.gender = gender || user.gender;
    user.age = age || user.age;
    user.profileImage = profileImage || user.profileImage;

    await user.save();

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error: " + error);
    res.status(500).json({ message: "Server error" });
  }
};

export { getUserProfile, updateUserProfile };
