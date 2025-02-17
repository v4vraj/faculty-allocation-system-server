const Program = require("../models/programModel");

exports.getAllPrograms = async (req, res) => {
  try {
    const programs = await Program.getAllPrograms();
    res.status(200).json(programs);
  } catch (error) {
    console.error("Error fetching programs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
