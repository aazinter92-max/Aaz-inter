const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');

dotenv.config();
connectDB();

const resetUser = async () => {
    try {
        const email = 'badshahkha656@gmail.com';
        const result = await User.deleteOne({ email });
        console.log(`Deleted user ${email}:`, result.deletedCount);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

resetUser();
