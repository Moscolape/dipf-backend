const express = require("express");
const {
  registerJambScholarshipApplicant,
} = require("../controllers/jambScholarshipController");
const upload = require("../config/multerConfig");

const router = express.Router();

router.post(
  "/register",
  upload.single("jambSlip"),
  registerJambScholarshipApplicant
);

module.exports = router;