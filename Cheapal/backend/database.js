// const mongoose = require('mongoose');
// const dotenv = require('dotenv');

// // 1. Load environment variables first
// dotenv.config({ path: '../.env' }); // Adjust path if your .env is in parent directory

// const connectDB = async () => {
//   // 2. Validate critical environment variables
//   const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
//   const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

//   if (missingVars.length > 0) {
//     console.error(`❌ Missing required environment variables: ${missingVars.join(', ')}`);
//     process.exit(1);
//   }

//   try {
//     console.log("🔗 Attempting MongoDB connection...");
    
//     // 3. Connection with enhanced options
//     const conn = await mongoose.connect(process.env.MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       serverSelectionTimeoutMS: 10000, // 10 second timeout
//       socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
//       maxPoolSize: 50, // Higher connection pool for production
//       retryWrites: true,
//       w: 'majority'
//     });

//     console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
//     console.log(`   Database: ${conn.connection.name}`);
//     console.log(`   Port: ${conn.connection.port}`);
    
//     return conn;
//   } catch (err) {
//     console.error('❌ MongoDB connection failed:');
    
//     // 4. Specific error handling
//     if (err.name === 'MongooseServerSelectionError') {
//       console.error('   • Server selection timeout - check your network connection');
//       console.error('   • Verify MongoDB cluster IP whitelist includes your IP');
//     } else if (err.message.includes('bad auth')) {
//       console.error('   • Authentication failed - verify username/password');
//       console.error('   • Check if user has proper privileges');
//     } else if (err.message.includes('ENOTFOUND')) {
//       console.error('   • DNS lookup failed - verify your MongoDB URI hostname');
//     }
    
//     console.error('   Full error:', err.message);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;





// const mongoose = require('mongoose');
// const dotenv = require('dotenv');

// dotenv.config();

// const connectDB = async () => {
//   const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
//   const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

//   if (missingVars.length > 0) {
//     console.error(`❌ Missing required environment variables: ${missingVars.join(', ')}`);
//     process.exit(1);
//   }

//   try {
//     console.log("🔗 Attempting MongoDB connection...");
//     const conn = await mongoose.connect(process.env.MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       serverSelectionTimeoutMS: 10000,
//       socketTimeoutMS: 45000,
//       maxPoolSize: 50,
//       retryWrites: true,
//       w: 'majority'
//     });

//     console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
//     console.log(`   Database: ${conn.connection.name}`);
//     console.log(`   Port: ${conn.connection.port}`);
    
//     return conn;
//   } catch (err) {
//     console.error('❌ MongoDB connection failed:');
//     if (err.name === 'MongooseServerSelectionError') {
//       console.error('   • Server selection timeout - check your network connection');
//       console.error('   • Verify MongoDB cluster IP whitelist includes your IP');
//     } else if (err.message.includes('bad auth')) {
//       console.error('   • Authentication failed - verify username/password');
//       console.error('   • Check if user has proper privileges');
//     } else if (err.message.includes('ENOTFOUND')) {
//       console.error('   • DNS lookup failed - verify your MongoDB URI hostname');
//     }
    
//     console.error('   Full error:', err.message);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  // Check for required environment variables
  const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error(`❌ Missing required environment variables: ${missingVars.join(', ')}`);
    process.exit(1);
  }

  try {
    console.log("🔗 Attempting MongoDB connection...");

    // Connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // Timeout for server selection
      socketTimeoutMS: 45000, // Socket timeout
      maxPoolSize: 50, // Maximum connection pool size
      retryWrites: true, // Enable retryable writes
      w: 'majority', // Write concern
      autoIndex: false, // Disable automatic index creation
      autoCreate: false // Disable automatic collection creation
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    console.log(`   Port: ${conn.connection.port}`);
    console.log(`🔗 Connected to database: "${conn.connection.db.databaseName}"`);

    // Index Management (Optional: Rebuild indexes if necessary)
    try {
      // Drop existing indexes for clean rebuild (use with caution in production)
      const collectionsToReindex = ['users', 'listings', 'chats', 'reviews'];
      for (const collection of collectionsToReindex) {
        try {
          await mongoose.connection.db.collection(collection).dropIndexes();
          console.log(`✅ Dropped all indexes for collection: ${collection}`);
        } catch (err) {
          console.warn(`⚠️ Could not drop indexes for collection: ${collection}. Reason: ${err.message}`);
        }
      }

      // Reinitialize models to rebuild indexes
      const models = mongoose.models;
      for (const modelName in models) {
        const model = models[modelName];
        try {
          await model.init();
          console.log(`✅ Rebuilt indexes for model: ${modelName}`);
        } catch (err) {
          console.warn(`⚠️ Failed to rebuild indexes for model: ${modelName}. Reason: ${err.message}`);
        }
      }

      // Verify indexes
      const usersIndexes = await mongoose.connection.db.collection('users').indexes();
      console.log('Active indexes for "users" collection:', usersIndexes.map(i => i.name));
    } catch (err) {
      console.warn('⚠️ Index initialization warning:', err.message);
    }

    return conn;
  } catch (err) {
    console.error('❌ MongoDB connection failed:');

    // Provide detailed error messages based on common issues
    if (err.code === 11000) {
      console.error('   • Duplicate key error - check your unique indexes');
    } else if (err.name === 'MongooseServerSelectionError') {
      console.error('   • Server selection timeout - check your network or MongoDB URI');
    } else if (err.message.includes('bad auth')) {
      console.error('   • Authentication failed - verify MongoDB username/password');
    } else if (err.message.includes('ENOTFOUND')) {
      console.error('   • DNS lookup failed - verify MongoDB URI');
    } else if (err.message.includes('ECONNREFUSED')) {
      console.error('   • Connection refused - ensure MongoDB is running and accessible');
    } else {
      console.error('   Full error:', err.message);
    }

    process.exit(1); // Exit the process on failure
  }
};

export default connectDB;