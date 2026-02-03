const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const Admin = require("./models/Admin");

dotenv.config();

const updateAdminEmail = async () => {
  try {
    await connectDB();
    console.log("🔄 Updating admin email...\n");

    const oldEmail = "aaz.secureAdmin.xt7k2m9@aazinternational.com";
    const newEmail = "Aaz.secure@Aazinternational.com";

    const admin = await Admin.findOne({ email: oldEmail });

    if (!admin) {
      console.log("❌ Admin not found");
      process.exit(1);
    }

    admin.email = newEmail;
    await admin.save();

    console.log("✅ Admin email updated successfully!\n");
    console.log("📋 Updated Admin:");
    console.log(`   Old Email: ${oldEmail}`);
    console.log(`   New Email: ${newEmail}`);
    console.log(`   Name: ${admin.name}`);
    console.log(`   Role: ${admin.role}`);
    console.log("\n⚠️  IMPORTANT: Update your .env file with the new email!");

    process.exit();
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

updateAdminEmail();
