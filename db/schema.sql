CREATE DATABASE expense_pro_db;
USE expense_pro_db;

-- 1. Companies (to store default currency)
CREATE TABLE companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    base_currency VARCHAR(3) DEFAULT 'USD'
);
select*from companies;

-- 2. Users (now linked to a Company and a Manager)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Manager', 'Employee') DEFAULT 'Employee',
    manager_id INT NULL,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (manager_id) REFERENCES users(id)
);
select*from users;
SELECT id, full_name, email, company_id, role FROM users;
-- 3. Expenses (Amount in original currency + Base currency)
CREATE TABLE expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    orig_amount DECIMAL(10, 2) NOT NULL,
    orig_currency VARCHAR(3) NOT NULL,
    base_amount DECIMAL(10, 2), -- Calculated via API later
    category VARCHAR(50),
    description TEXT,
    status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    current_step INT DEFAULT 1, -- For multi-level sequence
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 4. Approval Workflow Rules
CREATE TABLE approval_rules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT,
    rule_type ENUM('Sequence', 'Percentage', 'Specific_Approver', 'Hybrid'),
    min_percentage INT DEFAULT 0,
    required_approver_id INT, -- e.g., CFO User ID
    FOREIGN KEY (company_id) REFERENCES companies(id)
);
select*from approval_rules;
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE users;
TRUNCATE TABLE companies;
SET FOREIGN_KEY_CHECKS = 1;