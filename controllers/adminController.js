const bcrypt = require("bcryptjs");
const db = require("../config/db.js");

exports.createUser = async (req, res) => {
  if (req.user.role !== "Admin")
    return res.status(403).json({ message: "Access denied" });

  const {
    first_name,
    last_name,
    email,
    phone_number,
    username,
    password,
    role,
    department,
    position,
    max_hours,
  } = req.body;

  if (!first_name || !last_name || !email || !username || !password || !role) {
    return res
      .status(400)
      .json({ message: "All required fields must be provided" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (first_name, last_name, email, phone_number, username, password, role, department, position, max_hours, allocated_hours, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())",
      [
        first_name,
        last_name,
        email,
        phone_number,
        username,
        hashedPassword,
        role,
        department,
        position,
        max_hours,
        0,
      ]
    );

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
};
