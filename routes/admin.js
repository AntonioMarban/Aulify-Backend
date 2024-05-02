const express = require("express");
const router = express.Router();
const middleware = require("../middleware/jwt.middleware");
const {
  insertAdmin,
  getAdminRoleByUsername,
} = require("../controllers/admin.controller");

router.post("/admin", insertAdmin);
router.post("/admin/role", getAdminRoleByUsername);

module.exports = router;
