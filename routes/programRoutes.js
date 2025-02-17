const express = require("express");
const router = express.Router();
const programController = require("../controllers/programController");

// Get all programs
router.get("/getAllPrograms", programController.getAllPrograms);

module.exports = router;
