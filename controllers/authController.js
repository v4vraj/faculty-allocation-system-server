const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../config/db.js");
require("dotenv").config();

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await db.query("SELECT * FROM users1 WHERE email = ?", [
      username,
    ]);

    if (rows.length === 0)
      return res.status(401).json({ message: "User not found" });

    const user = rows[0];

    // Commenting out bcrypt and using a normal password check
    // const isMatch = await bcrypt.compare(password, user.password);
    const isMatch = password === user.password; // Normal password check

    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // Store token in HttpOnly cookie
    // Set the token in HttpOnly cookie after successful login
    res.cookie("token", token, {
      httpOnly: true, // Prevents access from JavaScript
      secure: process.env.NODE_ENV === "production", // Ensures cookie is sent only over HTTPS in production
      sameSite: "Strict", // Helps prevent CSRF attacks
      maxAge: 3600000, // Token expires in 1 hour
    });

    res.json({ message: "Login successful", role: user.role });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};

exports.getSession = (req, res) => {
  res.json({ user: req.user });
};
