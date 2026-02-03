const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Admin = require('./models/Admin');

dotenv.config();
connectDB();

const createSpecificAdmin = async () => {
    try {
        const email = process.env.ADMIN_EMAIL || 'admin@example.com';
        const password = process.env.ADMIN_PASSWORD || 'defaultPassword123';
        
        // Remove if exists to prevent duplicate error
        await Admin.deleteOne({ email });

        await Admin.create({
            name: 'Aazinter Admin',
            email: email,
            password: password,
            role: 'admin'
        });
        
        console.log(`✅ Admin created: ${email}`);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

createSpecificAdmin();
