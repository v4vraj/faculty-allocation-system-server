const userModel = require("../models/userModel");
const nodemailer = require("nodemailer");

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  host: process.env.EMAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PWD,
  },
});

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
exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userModel.getUserById(userId);
    if (user.length === 0) {
      return res.status(404).json({ message: "No user found" });
    }
    return res.status(200).json(user); // Return the list of faculty members
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getFacultyById = async (req, res) => {
  try {
    const { faculty_id } = req.params;
    console.log(faculty_id);
    const facultyDetails = await userModel.getFacultyById(faculty_id);
    if (facultyDetails.length === 0) {
      return res.status(404).json({ message: "No faculty found" });
    }
    return res.status(200).json(facultyDetails); // Return the list of faculty members
  } catch (error) {
    console.error("Error fetching faculty:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.allocateFaculty = async (req, res) => {
  try {
    const { course_id, faculty_id, program_id } = req.body;

    if (!course_id || !faculty_id || !program_id) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    console.log("Allocating Faculty:", { course_id, faculty_id, program_id });

    // Allocate faculty and get the inserted allocation ID
    const allocationId = await userModel.allocatedFaculty({
      course_id,
      faculty_id,
      program_id,
    });

    if (!allocationId) {
      return res.status(500).json({ message: "Faculty allocation failed." });
    }

    // Fetch allocated faculty details
    const allocationDetails = await userModel.getAllocationById(allocationId);
    if (!allocationDetails) {
      return res
        .status(500)
        .json({ message: "Failed to fetch allocation details." });
    }

    const { faculty_email, faculty_name, course_name, course_hours } =
      allocationDetails;

    console.log("Sending email to:", faculty_email);

    // Email notification
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: faculty_email,
      subject: "New Course Allocation",
      html: `<p>Dear ${faculty_name},</p>
             <p>You have been allocated a new course:</p>
             <ul>
               <li><strong>Course Name:</strong> ${course_name}</li>
               <li><strong>Course Hours:</strong> ${course_hours} Hours</li>
             </ul>
             <p>Please check your dashboard for more details.</p>
             <p>Best Regards,<br>Admin Team</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to", faculty_email);

    return res.status(201).json({ message: "Faculty allocated successfully" });
  } catch (error) {
    console.error("Error during faculty allocation:", error);
    return res
      .status(500)
      .json({ message: "Failed to allocate faculty", error: error.message });
  }
};

exports.getAllocationDetailsByFacultyId = async (req, res) => {
  try {
    const { faculty_id } = req.params; // Extract faculty_id from request params

    if (!faculty_id) {
      return res.status(400).json({ message: "Faculty ID is required." });
    }

    const allocations = await userModel.getAllocationDetailsByFacultyId(
      faculty_id
    );

    if (!allocations || allocations.length === 0) {
      return res
        .status(404)
        .json({ message: "No allocations found for this faculty." });
    }

    return res.status(200).json(allocations);
  } catch (error) {
    console.error("Error fetching faculty allocation details:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

exports.getAllAllocation = async (req, res) => {
  try {
    const allocations = await userModel.getAllAllocation();
    res.status(200).json(allocations);
  } catch (error) {
    console.error("Error fetching allocations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.updateFacultyById = async (req, res) => {
  try {
    const { faculty_id } = req.params;
    const facultyData = req.body;

    const result = await userModel.updateFacultyById(faculty_id, facultyData);
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Faculty not found or not updated" });
    }
    return res.status(200).json({ message: "Faculty updated successfully" });
  } catch (error) {
    console.error("Error updating faculty:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteFacultyById = async (req, res) => {
  try {
    const { faculty_id } = req.params;
    const result = await userModel.deleteFacultyById(faculty_id);
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "Faculty not deleted" });
    }
    return res.status(200).json({ message: "Faculty deleted successfully" });
  } catch (error) {
    console.error("Error deleting faculty:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
