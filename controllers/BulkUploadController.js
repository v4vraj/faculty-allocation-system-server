const multer = require("multer");
const XLSX = require("xlsx");
const Bulk = require("../models/BulkUploadModel.js");

// Configure Multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware to handle file upload
exports.uploadFile = upload.single("file");

exports.processExcelFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded. Please select an Excel file.",
      });
    }

    const { type } = req.body;
    if (!type) {
      return res.status(400).json({
        success: false,
        message: "Table name (type) is required.",
      });
    }

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    let jsonData = XLSX.utils.sheet_to_json(sheet);

    if (jsonData.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Uploaded file is empty. Please provide valid data.",
      });
    }

    console.log(`Processing bulk upload for: ${type}`);

    // Convert Excel serial numbers to proper date format only if the fields exist
    jsonData = jsonData.map((row) => {
      const updatedRow = { ...row };

      if ("created_at" in row) {
        updatedRow.created_at = XLSX.SSF.format(
          "yyyy-mm-dd hh:mm:ss",
          row.created_at
        );
      }

      if ("updated_at" in row) {
        updatedRow.updated_at = XLSX.SSF.format(
          "yyyy-mm-dd hh:mm:ss",
          row.updated_at
        );
      }

      return updatedRow;
    });

    // Insert data into the database
    const result = await Bulk.bulkInsert(type, jsonData);

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: "Data inserted successfully.",
        insertedCount: result.insertedCount || jsonData.length,
        duplicateCount: result.duplicateCount || 0,
        data: result.data,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to insert data due to unknown error.",
      error: result.error || "Unknown issue occurred",
    });
  } catch (error) {
    console.error("Bulk insert error:", error);

    // Handle duplicate entry error from MySQL
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message:
          "Duplicate entry detected. A record with the same primary key already exists.",
        error: error.sqlMessage,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
      error: error.message,
    });
  }
};
