const db = require("../config/db"); // MySQL connection

// Course model
const Course = {
  // Method to create a new course
  createCourse: async (course) => {
    const query =
      "INSERT INTO courses (course_name, course_code, course_hours,term_number,program_id) VALUES (?, ?, ?, ?, ?)";

    try {
      const [result] = await db.execute(query, [
        course.course_name,
        course.course_code,
        course.course_hours,
        course.term,
        course.program_id,
      ]);
      return result;
    } catch (err) {
      throw new Error("Error creating course: " + err.message);
    }
  },

  // Method to fetch all courses
  getAllCourses: async () => {
    const query = `
    SELECT 
      courses.*, 
      programs.program_name 
    FROM 
      courses 
    INNER JOIN 
      programs ON courses.program_id = programs.program_id;
  `;

    try {
      const [rows] = await db.execute(query);
      console.log(rows);

      return rows;
    } catch (err) {
      throw new Error("Error fetching courses: " + err.message);
    }
  },
  updateCourseById: async (id, courseData) => {
    console.log(courseData);
    const fields = Object.keys(courseData)
      .map((field) => `${field} = ?`)
      .join(", ");
    const values = [...Object.values(courseData), id];

    const query = `UPDATE courses SET ${fields} WHERE id = ?`;
    try {
      const [result] = await db.execute(query, values);
      return result;
    } catch (error) {
      console.error("Error updating course:", error);
      throw error;
    }
  },

  deleteCourseById: async (id) => {
    const query = "DELETE FROM courses WHERE id = ?";
    try {
      const [result] = await db.execute(query, [id]);
      return result;
    } catch (error) {
      console.error("Error deleting course:", error);
      throw error;
    }
  },
};

module.exports = Course;
