const express = require("express");
const router = express.Router();
const dotenv = require("dotenv").config();  
const { doLogin } = require("../controllers/login.controller");

router.post("/login", doLogin);

module.exports = router;
