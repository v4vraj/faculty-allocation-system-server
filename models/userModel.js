const db = require("../config/db.js");

exports.getAllFaculty = async () => {
  try {
    const query = "SELECT * FROM users1 WHERE role = 'Faculty'";
    const [rows] = await db.execute(query); // Execute the query and get rows
    return rows; // Return the fetched rows
  } catch (error) {
    throw error;
  }
};

exports.getFacultyById = async (facultyId) => {
  const query = "SELECT * FROM users1 WHERE id = ?";
  try {
    const [rows] = await db.execute(query, [facultyId]);
    return rows; // Return the fetched rows
  } catch (error) {
    throw error;
  }
};

exports.allocatedFaculty = async (data) => {
  const query =
    "INSERT INTO allocation (course_id, faculty_id, program_id) VALUES (?, ?, ?)";

  try {
    const [result] = await db.execute(query, [
      data.course_id,
      data.faculty_id,
      data.program_id,
    ]);

    return result.insertId;
  } catch (err) {
    throw new Error("Error allocating faculty: " + err.message);
  }
};
exports.getAllocationById = async (allocationId) => {
  const query = `
    SELECT 
      a.id,
      f.email AS faculty_email,
      f.first_name AS faculty_name,
      c.course_name,
      c.course_hours
    FROM allocation a 
    JOIN faculty f ON a.faculty_id = f.id
    JOIN courses c ON a.course_id = c.id
    WHERE a.id = ?
  `;

  try {
    const [rows] = await db.execute(query, [allocationId]);
    return rows.length ? rows[0] : null;
  } catch (error) {
    console.error("Error fetching allocation details:", error);
    throw error;
  }
};
exports.getAllocationDetailsByFacultyId = async (facultyId) => {
  const query = `
    SELECT 
      a.id AS allocation_id,
      c.course_name,
      c.course_code,
      c.course_hours,
      c.term_number,
      p.program_name
    FROM allocation a
    JOIN users1 f ON a.faculty_id = f.id
    JOIN courses c ON a.course_id = c.id
    JOIN programs p ON a.program_id = p.program_id
    WHERE a.faculty_id = ?;
  `;

  try {
    const [rows] = await db.execute(query, [facultyId]);
    return rows; // Returns an array of all allocations for a specific faculty
  } catch (error) {
    console.error("Error fetching allocation details for faculty:", error);
    throw error;
  }
};

exports.getAllAllocation = async () => {
  try {
    const query = `
      SELECT 
        a.id,
        c.course_name,
        p.program_name,
        CONCAT(f.first_name, ' ', f.last_name) AS faculty_name
      FROM allocation a
      JOIN courses c ON a.course_id = c.id
      JOIN programs p ON c.program_id = p.program_id
      JOIN users1 f ON a.faculty_id = f.id
    `;
    const [rows] = await db.execute(query);
    return rows;
  } catch (error) {
    console.error("Error fetching allocations", error);
  }
};
exports.updateFacultyById = async (facultyId, data) => {
  const query = `
    UPDATE users1 
    SET 
        first_name = ?, 
        last_name = ?, 
        email = ?, 
        phone_number = ?, 
        username = ?, 
        role = ?, 
        department = ?, 
        position = ?, 
        max_hours = ?, 
        allocated_hours = ?, 
        hours_completed = ?, 
        updated_at = NOW() 
    WHERE id = ?
  `;
  try {
    const [result] = await db.execute(query, [
      data.first_name,
      data.last_name,
      data.email,
      data.phone_number,
      data.username,
      data.role,
      data.department,
      data.position,
      data.max_hours,
      data.allocated_hours,
      data.hours_completed,
      facultyId,
    ]);
    return result.affectedRows;
  } catch (error) {
    console.error("Error updating faculty details:", error);
    throw error;
  }
};

exports.deleteFacultyById = async (facultyId) => {
  const query = `
    DELETE FROM users1 WHERE id = ? 
  `;
  try {
    const [result] = await db.execute(query, [facultyId]);
    return result.affectedRows;
  } catch (error) {
    console.error("Error deleting faculty details:", error);
    throw error;
  }
};
