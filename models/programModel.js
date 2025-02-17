const db = require("../config/db"); // Assuming you're using a database connection

exports.getAllPrograms = async () => {
  const query = "SELECT * FROM programs";
  const [rows] = await db.execute(query); // Execute query and get rows
  return rows; // Return the results
};
