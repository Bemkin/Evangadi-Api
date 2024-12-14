const express = require('express');
const https = require('https');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('./db');
const authMiddleware = require('./authMiddleware');
require('dotenv').config(); // Load environment variables

const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET; // Use environment variable for JWT secret

// Simple query to verify database connection
db.query('SELECT 1 + 1 AS solution', (error, results) => {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution); // Should output: The solution is: 2
});

// Endpoint to register new users
app.post('/api/register', async (req, res) => {
  const { username, first_name, last_name, email, password } = req.body;

  // Validate required fields
  if (!username || !first_name || !last_name || !email || !password) {
    return res.status(400).json({ error: 'Bad Request', message: 'Please provide all required fields' });
  }

  // Check for valid email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Bad Request', message: 'Invalid email format' });
  }

  try {
    // Check if the user already exists
    const userExists = await new Promise((resolve, reject) => {
      db.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], (err, results) => {
        if (err) return reject(err);
        resolve(results.length > 0);
      });
    });

    if (userExists) {
      return res.status(409).json({ error: 'Conflict', message: 'Username or email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    db.query('INSERT INTO users (username, first_name, last_name, email, password) VALUES (?, ?, ?, ?, ?)',
      [username, first_name, last_name, email, hashedPassword],
      (err, results) => {
        if (err) {
          return res.status(500).json({ error: 'Internal Server Error', message: 'Failed to register user' });
        }
        res.status(201).json({ message: 'User registered successfully' });
      });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', message: 'Something went wrong' });
  }
});

// Protect the /api/checkUser endpoint with the authentication middleware
app.get('/api/checkUser', authMiddleware, (req, res) => {
  res.status(200).json({
    message: 'Valid user',
    username: req.user.email, // Adjust based on your token payload
    userid: req.user.userId // Adjust based on your token payload
  });
});

// User data for demo purposes
const users = [
  { id: 1, email: 'john.doe@example.com', password: 'examplePassword' }
];

// Login endpoint to authenticate user and return JWT token
app.post('/api/user/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'User login successful', token });
  } else {
    res.status(401).json({ error: 'Unauthorized', message: 'Invalid username or password' });
  }
});

// Load SSL/TLS certificates
const privateKey = fs.readFileSync('server.key', 'utf8');
const certificate = fs.readFileSync('server.cert', 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Create HTTPS server
const httpsServer = https.createServer(credentials, app);
const PORT = process.env.PORT || 3000;
httpsServer.listen(PORT, () => {
  console.log(`HTTPS Server running on port ${PORT}`);
});
