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
