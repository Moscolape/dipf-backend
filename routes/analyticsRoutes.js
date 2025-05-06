const express = require("express");
const router = express.Router();
const { getApplicantsCountByState } = require("../controllers/analyticsController");

router.get("/analytics/state-count", getApplicantsCountByState);

module.exports = router;