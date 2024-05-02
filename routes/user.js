const express = require("express");
const router = express.Router();
const {
  getUser,
  insertUser,
  getUserByUsername,
  addToTimePlayed,
  getTotalUserCount,
  validateUserExistence,
  getAulifyUserCount,
  getUserAgesDistribution, 
  getLeaderboard,
} = require("../controllers/user.controller");

router.get("/user/total-user-count", getTotalUserCount);
router.get("/user/aulify-user-count", getAulifyUserCount);
router.get("/user/ages-distribution", getUserAgesDistribution);
router.get("/user/leaderboard", getLeaderboard);
router.get("/user/:userId", getUser);
router.post("/user", insertUser);
router.post("/user/specific-user", getUserByUsername);
router.post("/user/user-exists", validateUserExistence);
router.patch("/user/:userId/time-played", addToTimePlayed);

module.exports = router;
