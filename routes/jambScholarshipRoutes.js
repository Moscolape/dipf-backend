const express = require("express");
const {
  registerJambScholarshipApplicant,
  getAllJambScholarshipApplicants,
  getJambScholarshipApplicantById
} = require("../controllers/jambScholarshipController");
const upload = require("../config/multerConfig");

const router = express.Router();

router.post(
  "/register",
  upload.single("jambSlip"),
  registerJambScholarshipApplicant
);
router.get("/applicants", getAllJambScholarshipApplicants);
router.get("/applicants/:id", getJambScholarshipApplicantById);

module.exports = router;