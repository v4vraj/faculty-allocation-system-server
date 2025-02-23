const express = require("express");
const BulkUploadController = require("../controllers/BulkUploadController.js");
const router = express.Router();

router.post(
  "/upload",
  BulkUploadController.uploadFile,
  BulkUploadController.processExcelFile
);

module.exports = router;
