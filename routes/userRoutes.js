const express = require("express");
const userController = require("../controllers/userController");
const { route } = require("./authRoutes");

const router = express.Router();

// Route to get all faculty members
router.get("/getAllFaculty", userController.getFaculty);

module.exports = router;
