const userModel = require("../models/userModel");

exports.getFaculty = async (req, res) => {
  try {
    const facultyMembers = await userModel.getAllFaculty();
    if (facultyMembers.length === 0) {
      return res.status(404).json({ message: "No faculty found" });
    }
    return res.status(200).json(facultyMembers); // Return the list of faculty members
  } catch (error) {
    console.error("Error fetching faculty:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
