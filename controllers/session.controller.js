const pool = require("../helpers/mysql-config");
const jwt = require("jsonwebtoken");

const insertSession = (req, res) => {
  console.log("Received data:", req.body);
  const { sessionDate, platform, idUser } = req.body;
  const sql = `INSERT INTO session (sessionDate, platform, idUser) VALUES (?, ?, ?)`;
  pool.query(sql, [sessionDate, platform, idUser], (err, results, fields) => {
    if (err) res.json;
    res.json(results);
  });
};

const getTotalSessionCount = (req, res) => {
  const sql = `SELECT COUNT(*) AS total_session_count FROM session`;
  pool.query(sql, (err, results, fields) => {
    if (err) res.json(err);
    res.json(results);
  });
};

const getSessionCountPerPlatform = (req, res) => {
  const sql = `SELECT platform, COUNT(*) AS session_count FROM session GROUP BY platform;`; // Query
  pool.query(sql, (err, results, fields) => {
    if (err) res.json(err);
    res.json(results);
  });
};

const getSessionCountLast7Days = (req, res) => {
  const sql = `
    SELECT calendar_date AS sessionDate, COUNT(session.idSession) AS session_count
    FROM (
        SELECT CURDATE() - INTERVAL (a.a + (10 * b.a) + (100 * c.a)) DAY AS calendar_date
        FROM (
            SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
        ) AS a
        CROSS JOIN (
            SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
        ) AS b
        CROSS JOIN (
            SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
        ) AS c
    ) calendar
    LEFT JOIN session ON calendar.calendar_date = session.sessionDate
    WHERE calendar.calendar_date BETWEEN CURDATE() - INTERVAL 6 DAY AND CURDATE()
    GROUP BY calendar.calendar_date
    ORDER BY calendar.calendar_date;
  `;
  pool.query(sql, (err, results, fields) => {
    if (err) res.json(err);
    {
      console.error("Error fetching session count for last 7 days:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.json(results);
  });
};

const getSessionCountLast30Days = (req, res) => {
  const sql = `
    SELECT calendar_date AS sessionDate, COUNT(session.idSession) AS session_count
    FROM (
        SELECT CURDATE() - INTERVAL (a.a + (10 * b.a) + (100 * c.a)) DAY AS calendar_date
        FROM (
            SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
        ) AS a
        CROSS JOIN (
            SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
        ) AS b
        CROSS JOIN (
            SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
        ) AS c
    ) calendar
    LEFT JOIN session ON calendar.calendar_date = session.sessionDate
    WHERE calendar.calendar_date BETWEEN CURDATE() - INTERVAL 29 DAY AND CURDATE()
    GROUP BY calendar.calendar_date
    ORDER BY calendar.calendar_date;
  `;
  pool.query(sql, (err, results, fields) => {
    if (err) {
      console.error("Error fetching session count for last 30 days:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.json(results);
  });
};

const getAverageSessionTime = (req, res) => {
  const sql = `
    SELECT SEC_TO_TIME(SUM(TIME_TO_SEC(user.timePlayed)) / COUNT(session.idSession)) AS average_session_time_per_user
    FROM session
    INNER JOIN user ON session.idUser = user.idUser
  `;
  pool.query(sql, (err, results, fields) => {
    if (err) {
      console.error("Error fetching average session time:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    const averageTimePerUser = results[0].average_session_time_per_user;
    res.json({ average_session_time_per_user: averageTimePerUser });
  });
};

module.exports = {
  insertSession,
  getTotalSessionCount,
  getSessionCountPerPlatform,
  getSessionCountLast7Days,
  getSessionCountLast30Days,
  getAverageSessionTime,
};
