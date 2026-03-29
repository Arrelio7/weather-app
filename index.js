const express = require("express");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Create table if not exists
pool.query(`
    CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name TEXT,
        email TEXT
    )
`);

// API route
app.post("/contact", async (req, res) => {
    const { name, email } = req.body;
    try {
        await pool.query(
            "INSERT INTO contacts (name, email) VALUES ($1, $2)",
            [name, email]
        );
        res.json({ message: "Saved successfully ✅" });
    } catch (err) {
        console.error(err);
        res.json({ message: "Error saving ❌" });
    }
});

// View all contacts
app.get("/admin/contacts", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM contacts");
        res.json(result.rows);
    } catch (err) {
        res.json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});