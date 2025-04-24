const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// إنشاء قاعدة البيانات
const db = new sqlite3.Database('./notes.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        db.run(`
            CREATE TABLE IF NOT EXISTS notes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                phone TEXT NOT NULL,
                question TEXT NOT NULL,
                answer TEXT NOT NULL,
                type TEXT NOT NULL,
                timestamp TEXT NOT NULL,
                status TEXT NOT NULL
            )
        `);
    }
});

// API لإضافة ملاحظة
app.post('/notes', (req, res) => {
    const { phone, question, answer, type, timestamp, status } = req.body;
    const query = `INSERT INTO notes (phone, question, answer, type, timestamp, status) VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(query, [phone, question, answer, type, timestamp, status], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(201).json({ id: this.lastID });
        }
    });
});

// API لجلب جميع الملاحظات
app.get('/notes', (req, res) => {
    const query = `SELECT * FROM notes`;
    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// بدء الخادم
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
