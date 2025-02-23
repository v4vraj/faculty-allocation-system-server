const db = require("../config/db");

const Bulk = {
  bulkInsert: async (table, data) => {
    if (data.length === 0)
      return { success: false, message: "No data to insert" };

    try {
      // Check if table exists
      const [tableCheck] = await db.query("SHOW TABLES LIKE ?", [table]);
      if (tableCheck.length === 0) {
        return { success: false, message: `Table '${table}' does not exist` };
      }

      const columns = Object.keys(data[0]);
      const values = data.map((row) => columns.map((col) => row[col] || null));

      const placeholders = values
        .map(() => `(${columns.map(() => "?").join(", ")})`)
        .join(", ");

      const flattenedValues = values.flat();

      // Generating `ON DUPLICATE KEY UPDATE` statement
      const updateClause = columns
        .map((col) => `\`${col}\` = VALUES(\`${col}\`)`)
        .join(", ");

      const sql = `INSERT INTO \`${table}\` (${columns
        .map((col) => `\`${col}\``)
        .join(", ")}) VALUES ${placeholders} 
        ON DUPLICATE KEY UPDATE ${updateClause}`;

      await db.query(sql, flattenedValues);

      return { success: true, message: "Data inserted/updated successfully" };
    } catch (error) {
      console.error("Bulk insert error:", error);
      return {
        success: false,
        message: "Error inserting/updating data",
        error: error.message,
      };
    }
  },
};

module.exports = Bulk;
