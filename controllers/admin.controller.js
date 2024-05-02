const pool = require("../helpers/mysql-config");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');


const insertAdmin = (req, res) => {
  const { username, password, role } = req.body;
  const sql = `INSERT INTO admin(username, password, role) VALUES (?, SHA2(?, 224), ?)`;
  pool.query(sql, [username, password, role], (err, results, fields) => {
    if (err) {
      console.error("Error inserting admin:", err);
      return res.status(500).json({ error: "An error occurred while inserting the admin." });
    }
    res.json(results);
  });
};


const getAdminRoleByUsername = (req, res) => {
  const { username } = req.body; // Assuming the username is sent in the request body

  const sql = `SELECT role FROM admin WHERE username = ?`;

  pool.query(sql, [username], (err, results) => {
    if (err) {
      console.error('Error fetching admin role:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    const role = results[0].role;
    return res.json({ role });
  });
};

module.exports = { insertAdmin, getAdminRoleByUsername };
