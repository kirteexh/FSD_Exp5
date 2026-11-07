const mongoose = require('mongoose');

/**
 * Connect to MongoDB database using Mongoose
 * Reads the connection URI from environment variable MONGODB_URI
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`===============================================`);
    console.log(` MongoDB Connected Successfully!`);
    console.log(` Host:     ${conn.connection.host}`);
    console.log(` Database: ${conn.connection.name}`);
    console.log(` Port:     ${conn.connection.port}`);
    console.log(`===============================================`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;

