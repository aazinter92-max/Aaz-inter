const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const Admin = require("./models/Admin");

dotenv.config();

const checkAdmins = async () => {
  try {
    await connectDB();
    console.log("🔍 Checking all registered admins...\n");

    const admins = await Admin.find({});
    console.log(`Total Admins: ${admins.length}\n`);

    if (admins.length === 0) {
      console.log("No admins found in database.");
    } else {
      admins.forEach((admin, index) => {
        console.log(`${index + 1}. Name: ${admin.name}`);
        console.log(`   Email: ${admin.email}`);
        console.log(`   Role: ${admin.role}`);
        console.log(`   Created: ${admin.createdAt}`);
        console.log("-----------------------------------");
      });
    }

    process.exit();
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

checkAdmins();
