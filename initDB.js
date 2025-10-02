const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('wanderlust.sqlite');

db.serialize(() => {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fullname TEXT,
      email TEXT UNIQUE,
      password TEXT,
      contact TEXT
    )
  `);

  // Feedback table
  db.run(`DROP TABLE IF EXISTS feedback`);
  db.run(`
    CREATE TABLE feedback (
      name TEXT,
      email TEXT,
      phone TEXT,
      message TEXT,
      image TEXT
    )
  `);
});

console.log("Database initialized.");
db.close();