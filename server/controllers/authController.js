const db = require('../src/config/db');

exports.signup = async (req, res) => {
    const { companyName, currency, fullName, email, password } = req.body;

    try {
        // 1. Create the Company first
        const [companyResult] = await db.execute(
            'INSERT INTO companies (name, base_currency) VALUES (?, ?)',
            [companyName, currency]
        );
        const companyId = companyResult.insertId;

        // 2. Create the Admin User for that company
        // Note: In a real app, we would hash the password here!
        const [userResult] = await db.execute(
            'INSERT INTO users (company_id, full_name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
            [companyId, fullName, email, password, 'Admin']
        );

        res.status(201).json({
            message: "Company and Admin created successfully!",
            companyId,
            userId: userResult.insertId
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};