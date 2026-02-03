const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const Admin = require("./models/Admin");

dotenv.config();

const cleanupAdmins = async () => {
  try {
    await connectDB();
    console.log("🧹 Cleaning up admins...\n");

    const keepEmail = "admin@aazinternational.com";

    // Delete all admins except the one we want to keep
    const result = await Admin.deleteMany({ email: { $ne: keepEmail } });

    console.log(`✅ Deleted ${result.deletedCount} admin(s)\n`);

    // Show remaining admin
    const remaining = await Admin.findOne({ email: keepEmail });
    if (remaining) {
      console.log("📋 Remaining Admin:");
      console.log(`   Name: ${remaining.name}`);
      console.log(`   Email: ${remaining.email}`);
      console.log(`   Role: ${remaining.role}`);
    }

    process.exit();
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

cleanupAdmins();
