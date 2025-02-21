const express = require("express");
const router = express.Router();
const programController = require("../controllers/programController");

router.get("/getAllPrograms", programController.getAllPrograms);
router.get("/getAllYears", programController.getAllYears);
router.get(
  "/getProgramsByYear/:year",
  programController.getProgramsFromYearRange
);
router.put("/updateProgramById/:id", programController.updateProgramById);
router.delete("/deleteProgramById/:id", programController.deleteProgramById);

module.exports = router;
