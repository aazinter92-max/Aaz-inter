const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');

dotenv.config();
connectDB();

const checkUsers = async () => {
    try {
        console.log('Checking Users...');
        const users = await User.find({});
        console.log('Total Users:', users.length);
        users.forEach(u => console.log(`- ${u.name} (${u.email})`));
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkUsers();
