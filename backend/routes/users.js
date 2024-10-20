const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../middlewares/authentication");

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username/password required" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "User not found", login: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Invalid password", login: false });
    }

    const token = generateToken(user);
    res.json({ login: true, token: token, message: "Login successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const savedUser = await User.create({
      username,
      password: hashedPassword,
    });
    if (savedUser) return res.status(200).json("Registration successful!");
  } catch (error) {
    console.error(error);
    if (error.code === 11000 && error.keyPattern && error.keyPattern.username) {
      return res.status(400).json("Username already exists!");
    } else {
      return res.status(500).json("Sign-up error/Provide valid details!");
    }
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.id }).select(
      "username userId"
    );
    if (!user) return res.status(404).json({ message: "User not found!" });
    res.send(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const user = await User.find().select("username userId");
    if (!user) return res.status(404).json({ message: "No users!" });
    res.send(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
