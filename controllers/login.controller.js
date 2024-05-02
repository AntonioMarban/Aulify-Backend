const pool = require("../helpers/mysql-config");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

const doLogin = (req, res) => {
  let token = "";
  let result = {};
  const adminUsername = req.body.username;
  const adminPassword = req.body.password;
  const sql = `SELECT COUNT(*) AS cantidad FROM admin WHERE username=? AND password=SHA2(?,224)`;
  pool.query(sql, [adminUsername, adminPassword], (err, results, fields) => {
    if (err) res.json(err);
    if (results[0].cantidad === 1) {
      token = jwt.sign({ username: adminUsername }, process.env.KEYPHRASE, {
        expiresIn: 7200,
      });
      result = { token: token, mensaje: "Usuario autenticado correctamente" };
    } else {
      result = { mensaje: "Usuario o contraseña incorrectos" };
    }
    res.json(result)
  });
};

module.exports = { doLogin }
