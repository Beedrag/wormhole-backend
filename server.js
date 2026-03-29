const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// koneksi ke MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // kosong karena tadi pakai --initialize-insecure
  database: "wormhole"
});

// TEST koneksi
db.connect(err => {
  if (err) {
    console.log("DB ERROR:", err);
  } else {
    console.log("MySQL Connected ✅");
  }
});

// API LOGIN
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM users WHERE username=? AND password=?";
  
  db.query(sql, [username, password], (err, result) => {
    if (err) return res.json({ success: false });

    if (result.length > 0) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  });
});

// jalanin server
app.listen(3000, () => {
  console.log("Server jalan di http://localhost:3000");
});


app.post("/reset-password", (req, res) => {
  const { username, password } = req.body;

  console.log("RESET REQUEST:", username, password);

  const sql = "UPDATE users SET password=? WHERE username=?";

  db.query(sql, [password, username], (err, result) => {
    if (err) {
      console.log("SQL ERROR:", err);
      return res.json({ success: false });
    }

    console.log("RESULT:", result);

    if (result.affectedRows > 0) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  });
});