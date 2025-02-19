const Course = require("../models/courseModel");

exports.createCourse = async (req, res) => {
  const { course_name, course_code, course_hours, term, program_id } = req.body;
  try {
    const result = await Course.createCourse({
      course_name,
      course_code,
      course_hours,
      term,
      program_id,
    });

    // If the insertion is successful, send a response
    res.status(201).json({
      message: "Course created successfully",
      courseId: result.insertId, // You can return the inserted course's ID
    });
  } catch (err) {
    console.error("Error during course creation:", err);
    res.status(500).json({
      message: "Failed to create course",
      error: err.message,
    });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    console.log("HELLOOO");

    const courses = await Course.getAllCourses(); // Call the model method
    console.log(courses);

    res.status(200).json(courses); // Send courses as a JSON response
  } catch (err) {
    res.status(500).json({ error: err.message }); // Error response
  }
};
