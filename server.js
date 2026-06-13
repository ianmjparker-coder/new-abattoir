const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database setup
const dbPath = path.resolve(__dirname, 'abattoir.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to SQLite database.');
        // Initialize contacts table
        db.run(`
            CREATE TABLE IF NOT EXISTS contacts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                firstname TEXT NOT NULL,
                lastname TEXT NOT NULL,
                email TEXT NOT NULL,
                reason TEXT NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) console.error('Error creating table:', err);
            else console.log('Contacts table ready.');
        });
    }
});

// API Endpoint to receive Contact Us submissions
app.post('/api/contact', (req, res) => {
    const { firstname, lastname, email, reason } = req.body;

    if (!firstname || !lastname || !email || !reason) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const stmt = db.prepare('INSERT INTO contacts (firstname, lastname, email, reason) VALUES (?, ?, ?, ?)');
    stmt.run([firstname, lastname, email, reason], function (err) {
        if (err) {
            console.error('Error inserting contact:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        console.log(`New contact received: ${firstname} ${lastname}`);
        res.status(201).json({
            message: 'Contact request saved successfully',
            id: this.lastID
        });
    });
    stmt.finalize();
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
