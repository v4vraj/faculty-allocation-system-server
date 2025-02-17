const express = require("express");
const authController = require("../controllers/authController.js");
const authMiddleware = require("../middleware/authMiddleware.js");
const router = express.Router();

router.post("/login", authController.login); // Ensure this is properly defined
router.post("/logout", authController.logout);
router.get("/session", authMiddleware, authController.getSession);

module.exports = router;
