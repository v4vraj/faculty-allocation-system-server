const db = require("../config/db");

exports.getAllPrograms = async () => {
  const query = "SELECT * FROM programs";
  const [rows] = await db.execute(query);
  return rows;
};
