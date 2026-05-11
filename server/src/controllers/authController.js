import User from "../models/User.js";
import { createToken } from "../utils/createToken.js";

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role
});

export const signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: "Email already in use." });

  const user = await User.create({ name, email, password, role });
  const token = createToken(user);

  return res.status(201).json({
    message: "Signup successful.",
    token,
    user: sanitizeUser(user)
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials." });

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials." });

  const token = createToken(user);

  return res.status(200).json({
    message: "Login successful.",
    token,
    user: sanitizeUser(user)
  });
};

export const getMe = async (req, res) => {
  return res.status(200).json({ user: req.user });
};

export const getUsers = async (req, res) => {
  const users = await User.find().select("name email role");
  return res.status(200).json({ users });
};
