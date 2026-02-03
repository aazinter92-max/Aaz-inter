const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Admin = require('./models/Admin');
const Category = require('./models/Category');
const Product = require('./models/Product');

dotenv.config();
connectDB();

const seedData = async () => {
    try {
        await Admin.deleteMany({});
        await Category.deleteMany({});
        await Product.deleteMany({});

        // Create Admin
        await Admin.create({
            name: 'Super Admin',
            email: 'admin@aaz.com',
            password: 'password123', // Will be hashed by pre-save hook
            role: 'admin'
        });
        console.log('✅ Admin Created: admin@aaz.com / password123');

        // Create Categories
        const surgical = await Category.create({ name: 'Surgical Equipment', description: 'Tools for surgery' });
        const diagnostic = await Category.create({ name: 'Diagnostic', description: 'Imaging and testing' });

        // Create Products
        await Product.create([
            {
                name: 'Digital X-Ray Machine',
                description: 'High resolution digital x-ray for hospitals.',
                price: 15000,
                stock: 5,
                category: diagnostic._id,
                image: 'https://images.unsplash.com/photo-1516549655169-df83a092dd14?auto=format&fit=crop&q=80&w=300',
                isActive: true
            },
            {
                name: 'Surgical Scalpel Set',
                description: 'Professional grade stainless steel scalpels.',
                price: 120.50,
                stock: 50,
                category: surgical._id,
                image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=300',
                isActive: true
            }
        ]);
        console.log('✅ Sample Data Imported');
        process.exit();
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};

seedData();
