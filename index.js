// index.js
const db = require('./db');

// Simple query to verify database connection
db.query('SELECT 1 + 1 AS solution', (error, results) => {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution); // Should output: The solution is: 2
});
