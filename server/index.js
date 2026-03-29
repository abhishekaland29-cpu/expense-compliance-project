const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./src/config/db');

const app = express();
app.use(cors());
app.use(express.json());

// --- 1. AUTHENTICATION ROUTES ---

// Organization Signup
app.post('/api/auth/signup', async (req, res) => {
    const { companyName, fullName, email, password, baseCurrency } = req.body;
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        const [companyResult] = await connection.execute(
            'INSERT INTO companies (name, base_currency) VALUES (?, ?)',
            [companyName, baseCurrency]
        );
        const companyId = companyResult.insertId;
        const hashedPassword = await bcrypt.hash(password, 10);

        await connection.execute(
            'INSERT INTO users (company_id, full_name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
            [companyId, fullName, email, hashedPassword, 'Admin']
        );

        await connection.commit();
        res.status(201).json({ message: "Organization Created!" });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.sqlMessage || "Internal Server Error" });
    } finally {
        connection.release();
    }
});

// Login (Supports Admin & Employees)
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) return res.status(401).json({ message: "User not found" });

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { id: user.id, role: user.role, companyId: user.company_id }, 
            'your_jwt_secret', 
            { expiresIn: '1d' }
        );

        res.json({ 
            token, 
            user: { 
                id: user.id, 
                fullName: user.full_name, 
                role: user.role,
                companyId: user.company_id 
            } 
        });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// --- 2. ADMIN & TEAM MANAGEMENT ---

// Deploy New Member (restored missing route)
app.post('/api/admin/add-member', async (req, res) => {
    const { fullName, email, role, companyId, managerId } = req.body;
    try {
        // Default password for new members: User@123
        const tempPassword = await bcrypt.hash('User@123', 10);
        await db.execute(
            'INSERT INTO users (company_id, full_name, email, password_hash, role, manager_id) VALUES (?, ?, ?, ?, ?, ?)',
            [companyId, fullName, email, tempPassword, role, managerId || null]
        );
        res.status(201).json({ message: "Member Deployed!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Fetch Team for Organization Structure (restored missing route)
app.get('/api/admin/team/:companyId', async (req, res) => {
    try {
        const [rows] = await db.execute(
            'SELECT id, full_name, email, role FROM users WHERE company_id = ?',
            [req.params.companyId]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- 3. EXPENSE & COMPLIANCE ENGINE ---

// Submit New Expense (Employee Side)
app.post('/api/expenses/submit', async (req, res) => {
    const { userId, amount, category, description } = req.body;
    try {
        await db.execute(
            'INSERT INTO expenses (user_id, orig_amount, orig_currency, category, description, status) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, amount, 'USD', category, description, 'Pending']
        );
        res.status(201).json({ message: "Expense logged successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Fetch Personal History (Employee Side)
app.get('/api/expenses/my/:userId', async (req, res) => {
    try {
        const [rows] = await db.execute(
            'SELECT * FROM expenses WHERE user_id = ? ORDER BY created_at DESC',
            [req.params.userId]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Fetch ALL Company Expenses (Admin Compliance Queue)
app.get('/api/admin/all-expenses/:companyId', async (req, res) => {
    try {
        const [rows] = await db.execute(
            `SELECT e.*, u.full_name 
             FROM expenses e 
             JOIN users u ON e.user_id = u.id 
             WHERE u.company_id = ? 
             ORDER BY e.created_at DESC`,
            [req.params.companyId]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Approve/Reject Decision
app.post('/api/admin/approve-expense', async (req, res) => {
    const { expenseId, status, adminNote } = req.body;
    try {
        await db.execute(
            'UPDATE expenses SET status = ?, description = CONCAT(description, ?) WHERE id = ?',
            [status, adminNote ? ` (Note: ${adminNote})` : "", expenseId]
        );
        res.json({ message: `Expense ${status} successfully!` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));