const multer = require("multer");
const XLSX = require("xlsx");
const Bulk = require("../models/BulkUploadModel.js");
const path = require("path");
const fs = require("fs");

// Configure Multer to store files in /tmp
const storage = multer.diskStorage({
  destination: "/tmp", // Temporary directory for processing
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Middleware to handle file upload
exports.uploadFile = upload.single("file");

exports.processExcelFile = async (req, res) => {
  try {
    console.log("File received on server:", req.file);
    console.log("Request headers:", req.headers);
    console.log("Request body:", req.body);

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

    // Read Excel file from temporary storage
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    let jsonData = XLSX.utils.sheet_to_json(sheet);

    if (jsonData.length === 0) {
      // Delete file before returning error
      fs.unlinkSync(req.file.path);

      return res.status(400).json({
        success: false,
        message: "Uploaded file is empty. Please provide valid data.",
      });
    }

    console.log(`Processing bulk upload for: ${type}`);

    // Convert Excel serial numbers to proper date format if the fields exist
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

    // Delete file after processing
    fs.unlinkSync(req.file.path);

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
      message: "Failed to insert data due to an unknown error.",
      error: result.error || "Unknown issue occurred",
    });
  } catch (error) {
    console.error("Bulk insert error:", error);

    // Delete the file in case of any error
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }

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
