const db = require("../config/db");

const Programs = {
  getAllPrograms: async () => {
    const query = "SELECT * FROM programs";
    const [rows] = await db.execute(query);
    return rows;
  },

  getAllYears: async () => {
    const query = `
      SELECT year_range 
      FROM (
        SELECT DISTINCT CONCAT(start_year, '-', end_year) AS year_range, start_year 
        FROM programs
      ) AS subquery
      ORDER BY start_year ASC;
    `;
    const [rows] = await db.execute(query);
    return rows;
  },

  getProgramsFromYearRange: async (start_year, end_year) => {
    const query =
      "SELECT * FROM programs WHERE start_year >= ? AND end_year <= ?";
    try {
      const [rows] = await db.execute(query, [start_year, end_year]);
      console.log("Query rows:", rows);
      return rows;
    } catch (error) {
      console.error("Error executing query:", error);
      throw error;
    }
  },

  updateProgramById: async (id, programData) => {
    console.log(programData);
    const fields = Object.keys(programData)
      .map((field) => `${field} = ?`)
      .join(", ");
    const values = [...Object.values(programData), id];

    const query = `UPDATE programs SET ${fields} WHERE program_id = ?`;
    try {
      const [result] = await db.execute(query, values);
      return result;
    } catch (error) {
      console.error("Error updating program:", error);
      throw error;
    }
  },

  deleteProgramById: async (id) => {
    const query = "DELETE FROM programs WHERE program_id = ?";
    try {
      const [result] = await db.execute(query, [id]);
      return result;
    } catch (error) {
      console.error("Error deleting program:", error);
      throw error;
    }
  },
};

module.exports = Programs;
