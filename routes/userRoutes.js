const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.get("/getAllFaculty", userController.getFaculty);
router.get("/getFacultyById/:faculty_id", userController.getFacultyById);
router.put("/updateFacultyById/:faculty_id", userController.updateFacultyById);
router.post("/allocateFaculty", userController.allocateFaculty);
router.get(
  "/getAllocationByFaculty/:faculty_id",
  userController.getAllocationDetailsByFacultyId
);
router.get("/getAllAllocation", userController.getAllAllocation);
router.delete(
  "/deleteFacultyById/:faculty_id",
  userController.deleteFacultyById
);

module.exports = router;
