const express = require("express");
const {
  registerJambScholarshipApplicant,
  getAllJambScholarshipApplicants,
  getJambScholarshipApplicantById,
  deleteJambScholarshipApplicantById
} = require("../controllers/jambScholarshipController");
const upload = require("../config/multerConfig");

const router = express.Router();

router.post(
  "/register",
  upload.fields([
    { name: "jambSlip", maxCount: 1 },
    { name: "passport", maxCount: 1 },
    // { name: "oLevelSlip", maxCount: 1 },
  ]),
  registerJambScholarshipApplicant
);
router.get("/applicants", getAllJambScholarshipApplicants);
router.get("/applicants/:id", getJambScholarshipApplicantById);
router.delete("/applicants/:id", deleteJambScholarshipApplicantById);

module.exports = router;
