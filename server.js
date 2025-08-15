// backend/server.js
const express = require('express');
const cors = require('cors');
const { db, loadTrainDataFromCSV } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Load train data from CSV when the server starts
loadTrainDataFromCSV();

app.post('/api/query', (req, res) => {
  const query = req.body.query.toLowerCase();

  db.all(
    `SELECT * FROM trains WHERE 
      LOWER(train_name) LIKE ? OR 
      LOWER(source) LIKE ? OR 
      LOWER(destination) LIKE ?`,
    [`%${query}%`, `%${query}%`, `%${query}%`],
    (err, rows) => {
      if (err) {
        console.error('❌ Query error:', err.message);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(rows);
    }
  );
});

app.listen(5000, () => {
  console.log('🚀 Server running on http://localhost:5000');
});
