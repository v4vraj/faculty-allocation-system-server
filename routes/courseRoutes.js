const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");

router.get("/getAllCourses", courseController.getAllCourses);
router.get("/getNonAllocatedCourses", courseController.getNonAllocatedCourses);
router.post("/createCourse", courseController.createCourse);
router.put("/updateCourseById/:id", courseController.updateCourseById);
router.delete("/deleteCourseById/:id", courseController.deleteCourseById);
module.exports = router;
