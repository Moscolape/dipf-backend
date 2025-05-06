const express = require("express");
const router = express.Router();
const {
  getApplicantsCountByState,
  getApplicantsCountBySex,
  getApplicantsCountByJambScoreRange,
} = require("../controllers/analyticsController");

router.get("/analytics/state-count", getApplicantsCountByState);
router.get("/analytics/sex-count", getApplicantsCountBySex);
router.get("/analytics/jamb-score-range", getApplicantsCountByJambScoreRange);

module.exports = router;