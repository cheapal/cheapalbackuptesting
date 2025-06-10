import mongoose from 'mongoose';
import User from '../models/userModel.js';
import dotenv from 'dotenv';

dotenv.config();

const fixIndexes = async () => {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 30000
    });

    console.log('✅ Connected to MongoDB');
    console.log('🔄 Starting index migration...');

    const collection = mongoose.connection.db.collection('users');
    
    // 1. Drop existing indexes
    console.log('🗑️ Dropping existing indexes...');
    await collection.dropIndexes();
    console.log('✅ All indexes dropped');

    // 2. Rebuild indexes from schema
    console.log('🔨 Rebuilding indexes from schema...');
    await User.init(); 
    console.log('✅ Indexes rebuilt from schema');

    // 3. Verify
    const indexes = await collection.indexes();
    console.log('\n🎉 Final Index Structure:');
    console.log(indexes.map(i => ({
      name: i.name,
      unique: !!i.unique,
      keys: Object.keys(i.key),
      collation: i.collation || 'none'
    })));

    console.log('\n✔️ Migration completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Migration failed:');
    console.error(err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
};

fixIndexes();