// db.js
const mysql = require('mysql2');
const config = require('./config');

// Create a connection to the database
const connection = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database
});

// Open the MySQL connection
connection.connect(error => {
  if (error) {
    console.error('Database connection failed: ' + error.stack);
    return;
  }
  console.log('Connected to the database.');
});

module.exports = connection;
