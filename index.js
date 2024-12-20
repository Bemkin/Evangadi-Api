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
const cors = require('cors');
app.use(cors()); // Enable CORS for all routes

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
      db.query('SELECT * FROM usertable WHERE username = ? OR email = ?', [username, email], (err, results) => {
        if (err) {
          console.error('Database query error:', err);
          return reject(err);
        }
        resolve(results.length > 0);
      });
    });

    if (userExists) {
      return res.status(409).json({ error: 'Conflict', message: 'Username or email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    db.query('INSERT INTO usertable (username, first_name, last_name, email, password) VALUES (?, ?, ?, ?, ?)',
      [username, first_name, last_name, email, hashedPassword],
      (err, results) => {
        if (err) {
          console.error('Database insertion error:', err);
          return res.status(500).json({ error: 'Internal Server Error', message: 'Failed to register user' });
        }
        console.log('User registered successfully:', results.insertId);
        res.status(201).json({ message: 'User registered successfully' });
      });
  } catch (error) {
    console.error('User registration error:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Something went wrong' });
  }
});

// Endpoint to authenticate users and return a JWT token
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  // Validate that both email and password are provided
  if (!email || !password) {
    return res.status(400).json({ error: 'Bad Request', message: 'Please provide both email and password' });
  }

  try {
    // Fetch user from the database
    const user = await new Promise((resolve, reject) => {
      db.query('SELECT * FROM usertable WHERE email = ?', [email], (err, results) => {
        if (err) {
          console.error('Database query error:', err);
          return reject(err);
        }
        if (results.length === 0) {
          console.error('User not found:', email);
          return resolve(null);
        }
        resolve(results[0]);
      });
    });

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Invalid email or password' });
    }

    // Compare provided password with the hashed password in the database
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.error('Invalid password for user:', email);
      return res.status(401).json({ error: 'Unauthorized', message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.user_id, email: user.email, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'User login successful', token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Something went wrong' });
  }
});

// Endpoint to post an answer for a specific question
app.post('/api/answer', async (req, res) => {
  const { question_id, user_id, body } = req.body;

  // Validate required fields
  if (!question_id || !user_id || !body) {
    return res.status(400).json({ error: 'Bad Request', message: 'Please provide question_id, user_id, and body' });
  }

  try {
    // Insert the new answer into the database
    db.query('INSERT INTO answertable (question_id, user_id, body) VALUES (?, ?, ?)',
      [question_id, user_id, body],
      (err, results) => {
        if (err) {
          console.error('Database insertion error:', err);
          return res.status(500).json({ error: 'Internal Server Error', message: 'Failed to post answer' });
        }
        res.status(201).json({ message: 'Answer posted successfully', answer_id: results.insertId });
      });
  } catch (error) {
    console.error('Error posting answer:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Something went wrong' });
  }
});

// Endpoint to retrieve answers for a specific question
app.get('/api/answer/:question_id', async (req, res) => {
  const { question_id } = req.params;

  // Validate question_id
  if (!question_id) {
    return res.status(400).json({ error: 'Bad Request', message: 'Question ID is required' });
  }

  try {
    // Fetch answers from the database
    const answers = await new Promise((resolve, reject) => {
      db.query('SELECT * FROM answertable WHERE question_id = ?', [question_id], (err, results) => {
        if (err) {
          console.error('Database query error:', err);
          return reject(err);
        }
        resolve(results);
      });
    });

    // Check if answers exist
    if (answers.length === 0) {
      return res.status(404).json({ error: 'Not Found', message: 'No answers found for the given question ID' });
    }

    // Return answers
    res.status(200).json({ message: 'Answers retrieved successfully', answers });
  } catch (error) {
    console.error('Error retrieving answers:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Something went wrong' });
  }
});

// Endpoint to fetch all questions
app.get('/api/question', authMiddleware, async (req, res) => {
  try {
    // Fetch all questions from the database
    const questions = await new Promise((resolve, reject) => {
      db.query('SELECT * FROM questiontable', (err, results) => {
        if (err) {
          console.error('Database query error:', err);
          return reject(err);
        }
        resolve(results);
      });
    });

    // Return questions with unique id
    res.status(200).json({ message: 'Questions retrieved successfully', questions });
  } catch (error) {
    console.error('Error retrieving questions:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Something went wrong' });
  }
});



// Endpoint to retrieve details of a specific question
app.get('/api/question/:question_id', async (req, res) => {
  const { question_id } = req.params;

  // Validate question_id
  if (!question_id) {
    return res.status(400).json({ error: 'Bad Request', message: 'Question ID is required' });
  }

  try {
    // Fetch question details from the database
    const question = await new Promise((resolve, reject) => {
      db.query('SELECT * FROM questiontable WHERE question_id = ?', [question_id], (err, results) => {
        if (err) {
          console.error('Database query error:', err);
          return reject(err);
        }
        if (results.length === 0) {
          return resolve(null);
        }
        resolve(results[0]);
      });
    });

    // Check if question exists
    if (!question) {
      return res.status(404).json({ error: 'Not Found', message: 'Question not found' });
    }

    // Return question details
    res.status(200).json({ message: 'Question retrieved successfully', question });
  } catch (error) {
    console.error('Error retrieving question:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Something went wrong' });
  }
});

// Endpoint to create a new question
app.post('/api/question', authMiddleware, async (req, res) => {
  const { user_id, title, body } = req.body;

  if (!user_id || !title || !body) {
    return res.status(400).json({ error: 'Bad Request', message: 'Please provide user_id, title, and body' });
  }

  try {
    const username = await new Promise((resolve, reject) => {
      db.query('SELECT username FROM usertable WHERE user_id = ?', [user_id], (err, results) => {
        if (err) {
          console.error('Database query error:', err);
          return reject(err);
        }
        if (results.length === 0) {
          return resolve(null);
        }
        console.log('User found:', results[0].username); // Debugging: Log fetched username
        resolve(results[0].username);
      });
    });

    if (!username) {
      return res.status(404).json({ error: 'Not Found', message: 'User not found' });
    }

    db.query('INSERT INTO questiontable (user_id, title, body) VALUES (?, ?,  ?)',
      [user_id, title, body],
      (err, results) => {
        if (err) {
          console.error('Database insertion error:', err);
          return res.status(500).json({ error: 'Internal Server Error', message: 'Failed to create question' });
        }
        console.log('Question created successfully:', results.insertId); // Debugging: Log the inserted question ID
        res.status(201).json({ message: 'Question created successfully', question_id: results.insertId });
      });
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Something went wrong' });
  }
});




// Protect the /api/checkUser endpoint with the authentication middleware
app.get('/api/checkUser', authMiddleware, (req, res) => {
  const { userId } = req.user; // Assuming userId is in the token payload

  // Fetch the user details from the database
  db.query('SELECT username FROM usertable WHERE user_id = ?', [userId], (err, results) => { // Adjust column name based on your schema
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Internal Server Error', message: 'Something went wrong' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Not Found', message: 'User not found' });
    }

    const { username } = results[0];
    console.log('Fetched username:', username); // Debugging: Log fetched username

    res.status(200).json({
      message: 'Valid user',
      username, // Return the actual username
      userId // Return the user ID
    });
  });
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
