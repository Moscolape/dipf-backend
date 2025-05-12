const express = require("express");
const router = express.Router();
const {
  getApplicantsCountByGeopoliticalZones,
  getApplicantsCountBySex,
  getApplicantsCountByJambScoreRange,
  getApplicantsCountByJambExamStateZones,
} = require("../controllers/analyticsController");

router.get("/analytics/zone-count", getApplicantsCountByGeopoliticalZones);
router.get("/analytics/sex-count", getApplicantsCountBySex);
router.get("/analytics/jamb-score-range", getApplicantsCountByJambScoreRange);
router.get(
  "/analytics/jamb-state-zones",
  getApplicantsCountByJambExamStateZones
);

module.exports = router;