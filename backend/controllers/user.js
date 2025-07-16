import { User } from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        message: "Invalid data",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
        success: false,
      });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
        success: false,
      });
    }

    const tokenData = { id: user._id };
    const token = jwt.sign(tokenData, "dfbvdkjzfnvkjzdnfvkzdnjf", {
      expiresIn: "1h",
    });

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: false, 
        sameSite: "lax",
        maxAge: 60 * 60 * 1000, 
      })
      .json({
        message: `Welcome back ${user.fullName}`,
        user,
        success: true,
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const Logout = async (req, res) => {
  return res
    .status(200)
    .cookie("token", "", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      expires: new Date(0), 
    })
    .json({
      message: "User logged out successfully.",
      success: true,
    });
};

export const Register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(401).json({
        message: "Invalid data",
        success: false,
      });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(401).json({
        message: "This email is already used",
        success: false,
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 16);

    await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "Account created successfully.",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
