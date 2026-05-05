const mysql = require('mysql2');
const http = require('http');

// 🔁 Function to connect with retry
let db;

function connectDB() {
  db = mysql.createConnection({
    host: 'mysql_db',   // Docker service name
    user: 'root',
    password: 'root',
    database: 'testdb'
  });

  db.connect(err => {
    if (err) {
      console.log("❌ DB connection failed. Retrying...");
      setTimeout(connectDB, 3000); // retry after 3 sec
    } else {
      console.log("✅ Connected to MySQL");
    }
  });
}

connectDB();

// 🌐 HTTP Server
const server = http.createServer((req, res) => {

  if (req.url === '/') {
    res.end('Backend running 🚀');
  }

  // ➕ Add user
  else if (req.url.startsWith('/add')) {
    const name = req.url.split('=')[1] || 'Guest';

    db.query(
      "INSERT INTO users (name) VALUES (?)",
      [name],
      (err, result) => {
        if (err) {
          res.end("Error inserting data ❌");
        } else {
          res.end("User added ✅");
        }
      }
    );
  }

  // 📄 Get users
  else if (req.url === '/users') {
    db.query("SELECT * FROM users", (err, results) => {
      if (err) {
        res.end("Error fetching data ❌");
      } else {
        res.end(JSON.stringify(results));
      }
    });
  }

  else {
    res.end("Route not found ❌");
  }
});

// 🚀 Start server
server.listen(5000, () => {
  console.log("Server running on port 5000 🚀");
});
