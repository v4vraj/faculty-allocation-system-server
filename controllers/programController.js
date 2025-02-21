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

exports.getProgramsFromYearRange = async (req, res) => {
  try {
    const { year } = req.params;
    console.log("Year range received:", year);

    const [start_year, end_year] = year.split("-");
    console.log(start_year, end_year);

    if (!start_year || !end_year) {
      console.error("Invalid year range received.");
      return res.status(400).json({ message: "Invalid year range." });
    }

    const results = await Program.getProgramsFromYearRange(
      start_year,
      end_year
    );
    return res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching programs:", error);
    res.status(500).json({ error: "Failed to fetch programs" });
  }
};

exports.getAllYears = async (req, res) => {
  try {
    const years = await Program.getAllYears();
    res.status(200).json(years);
  } catch (err) {
    console.error("Error fetching years:", err);
    res.status(500).json({ error: "Failed to fetch years" });
  }
};

// Update program by ID
exports.updateProgramById = async (req, res) => {
  try {
    const { id } = req.params;
    const programData = req.body;

    if (!id || Object.keys(programData).length === 0) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    const updatedProgram = await Program.updateProgramById(id, programData);

    if (updatedProgram.affectedRows === 0) {
      return res.status(404).json({ message: "Program not found" });
    }

    res.status(200).json({ message: "Program updated successfully" });
  } catch (error) {
    console.error("Error updating program:", error);
    res.status(500).json({ error: "Failed to update program" });
  }
};

// Delete program by ID
exports.deleteProgramById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    const deletedProgram = await Program.deleteProgramById(id);

    if (deletedProgram.affectedRows === 0) {
      return res.status(404).json({ message: "Program not found" });
    }

    res.status(200).json({ message: "Program deleted successfully" });
  } catch (error) {
    console.error("Error deleting program:", error);
    res.status(500).json({ error: "Failed to delete program" });
  }
};
