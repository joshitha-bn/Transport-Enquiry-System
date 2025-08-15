// backend/db.js
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const csv = require('csv-parser');
const path = require('path');

const db = new sqlite3.Database('./trains.db');

// Create the table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS trains (
      
      train_name TEXT,
      source TEXT,
      destination TEXT,
      departure_time TEXT,
      arrival_time TEXT
    )
  `);
});

// Renamed function to load CSV data
function loadTrainDataFromCSV() {
  const csvFilePath = path.join(__dirname, 'Train_details.csv');

  if (!fs.existsSync(csvFilePath)) {
    console.error(`❌ CSV file not found at: ${csvFilePath}`);
    return;
  }

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
      console.log('🔄 Inserting row:', row);
      db.run(
        `INSERT INTO trains ( train_name, source, destination, departure_time, arrival_time) VALUES ( ?, ?, ?, ?, ?)`,
        [
          
          row.train_name,
          row.source,
          row.destination,
          row.departure_time,
          row.arrival_time,
        ],
        (err) => {
          if (err) console.error('❌ DB insert error:', err.message);
        }
      );
    })
    .on('end', () => {
      console.log('✅ Train data loaded from CSV successfully.');
    })
    .on('error', (err) => {
      console.error('❌ CSV read error:', err.message);
    });
}

module.exports = { db, loadTrainDataFromCSV };
