const express = require("express");
const router = express.Router();
const {
  insertSession,
  getTotalSessionCount,
  getSessionCountPerPlatform,
  getSessionCountLast7Days,
  getSessionCountLast30Days,
  getAverageSessionTime,
} = require("../controllers/session.controller");

router.post("/session", insertSession);

router.get("/session/total-session-count", getTotalSessionCount);
router.get("/session/session-count-per-platform", getSessionCountPerPlatform);
router.get("/session/session-count-last-7-days", getSessionCountLast7Days);
router.get("/session/session-count-last-30-days", getSessionCountLast30Days);
router.get("/session/average-session-time", getAverageSessionTime);

module.exports = router;
