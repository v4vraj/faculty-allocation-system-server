const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");

// Get all programs
router.get("/getAllCourses", courseController.getAllCourses);
router.post("/createCourse", courseController.createCourse);

module.exports = router;
