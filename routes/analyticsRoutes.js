const express = require("express");
const router = express.Router();
const {
    getApplicantsCountByGeopoliticalZones,
  getApplicantsCountBySex,
  getApplicantsCountByJambScoreRange,
} = require("../controllers/analyticsController");

router.get("/analytics/zone-count", getApplicantsCountByGeopoliticalZones);
router.get("/analytics/sex-count", getApplicantsCountBySex);
router.get("/analytics/jamb-score-range", getApplicantsCountByJambScoreRange);

module.exports = router;