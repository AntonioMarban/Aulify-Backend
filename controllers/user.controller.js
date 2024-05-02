const pool = require("../helpers/mysql-config");
const jwt = require("jsonwebtoken");

const getUser = (req, res) => {
  const userId = req.params.userId; // Extract userId from the request parameters
  const sql = `SELECT * FROM user WHERE idUser = ?`; // Query to select user by ID
  pool.query(sql, [userId], (err, results, fields) => {
    if (err) {
      console.error("Error fetching user data:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json(results[0]);
  });
};

const getUserByUsername = (req, res) => {
  const { username, isAulifyUser } = req.body; // Extract username and boolean value from JSON body
  const sql = `SELECT * FROM user WHERE username = ? AND isAulifyUser = ?;`;
  pool.query(sql, [username, isAulifyUser], (err, results, fields) => {
    if (err) {
      console.error("Error fetching user data:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json(results[0]);
  });
};

const insertUser = (req, res) => {
  const { username, age, timePlayed, isAulifyUser } = req.body; // Data received from the POST request body
  const sql = `INSERT INTO user(username, age, timePlayed, isAulifyUser) VALUES (?, ?, ?, ?)`; // Query
  pool.query(
    sql,
    [username, age, timePlayed, isAulifyUser],
    (err, results, fields) => {
      if (err) {
        console.error("Error inserting user:", err);
        res
          .status(500)
          .json({ error: "An error occurred while inserting the user." });
      } else {
        res.json({ insertId: results.insertId });
      }
    }
  );
};

const getTotalUserCount = (req, res) => {
  const sql = `SELECT COUNT(*) AS total_user_count FROM user`; // Query
  pool.query(sql, (err, results, fields) => {
    if (err) res.json(err);
    res.json(results);
  });
};

const validateUserExistence = (req, res) => {
  const { username, isAulifyUser } = req.body; // Extract username and boolean value from JSON body
  const sql = `SELECT EXISTS (
                SELECT 1 FROM user
                WHERE username = ? AND isAulifyUser = ?
              ) AS userExists;`;
  pool.query(sql, [username, isAulifyUser], (err, results, fields) => {
    if (err) {
      return res.status(500).json({ error: "Internal server error" });
    }
    const userExists = !!results[0].userExists; // Convert result to boolean
    return res.json({ userExists });
  });
};

const addToTimePlayed = (req, res) => {
  const idUser = req.params.userId; // Extract userId from the request parameters
  const { timePlayed } = req.body;
  const sql = `UPDATE user SET timePlayed = ADDTIME(timePlayed, ?) WHERE idUser = ?`;
  pool.query(sql, [timePlayed, idUser], (err, results, fields) => {
    if (err) res.json(err);
    else {
      res.json(results);
    }
  })
};

const getAulifyUserCount = (req, res) => {
  const aulifySql = `SELECT COUNT(*) AS aulify_user_count FROM user WHERE isAulifyUser = 1`;
  pool.query(aulifySql, (err, aulifyUserResults) => {
    if (err) {
      console.error("Error fetching Aulify user count:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    
    const aulifyUserCount = aulifyUserResults[0].aulify_user_count;

    const nonAulifySql = `SELECT COUNT(*) AS non_aulify_user_count FROM user WHERE isAulifyUser = 0`;
    pool.query(nonAulifySql, (err, nonAulifyUserResults) => {
      if (err) {
        console.error("Error fetching non-Aulify user count:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      const nonAulifyUserCount = nonAulifyUserResults[0].non_aulify_user_count;
      
      return res.json({ aulifyUsers: aulifyUserCount, notAulifyUsers: nonAulifyUserCount });
    });
  });
};

const getUserAgesDistribution = (req, res) => {
  const sql = `SELECT age, COUNT(*) AS age_count FROM user GROUP BY age`;
  pool.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching user ages distribution:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    const ageDistribution = results.reduce((acc, { age, age_count }) => {
      acc[age] = age_count;
      return acc;
    }, {});

    return res.json(ageDistribution);
  });
};

const getLeaderboard = (req, res) => {
  const sql = `
    SELECT idUser, username, age, timePlayed, isAulifyUser
    FROM user
    ORDER BY timePlayed DESC
  `;
  pool.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching leaderboard data:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.json(results);
  });
};

module.exports = {
  getUser,
  insertUser,
  getUserByUsername,
  addToTimePlayed,
  getTotalUserCount,
  validateUserExistence,
  getAulifyUserCount,
  getUserAgesDistribution,
  getLeaderboard,
};