const express = require("express");
const cors = require("cors");
const multer = require("multer");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const port = process.env.PORT || 3000;

const login = require("./routes/login");
const admin = require("./routes/admin");
const session = require("./routes/session");
const user = require("./routes/user");

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(multer().array());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/", login);
app.use("/", admin);
app.use("/", session);
app.use("/", user);
// función callback
app.listen(port, () => {
  console.log(`Conectado al puerto ${port}`);
});
