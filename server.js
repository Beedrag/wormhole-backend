const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ================= DATABASE =================
// ⚠️ sementara masih localhost (nanti kita ganti ke Railway DB)
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "wormhole"
});

db.connect((err) => {
  if (err) {
    console.log("DB ERROR:", err);
  } else {
    console.log("MySQL Connected ✅");
  }
});

// ================= ROUTES =================

// test API (buat cek backend hidup)
app.get("/api/test", (req, res) => {
  res.json({ message: "API jalan!" });
});

// LOGIN
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM users WHERE username=? AND password=?";

  db.query(sql, [username, password], (err, result) => {
    if (err) {
      console.log("LOGIN ERROR:", err);
      return res.json({ success: false });
    }

    if (result.length > 0) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  });
});

// RESET PASSWORD
app.post("/reset-password", (req, res) => {
  const { username, password } = req.body;

  const sql = "UPDATE users SET password=? WHERE username=?";

  db.query(sql, [password, username], (err, result) => {
    if (err) {
      console.log("RESET ERROR:", err);
      return res.json({ success: false });
    }

    if (result.affectedRows > 0) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  });
});

// ================= SERVER =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server jalan di port " + PORT);
});
