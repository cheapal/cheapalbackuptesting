import mongoose from 'mongoose';
import User from './models/userModel.js';
import dotenv from 'dotenv';

dotenv.config();

const forceFixIndexes = async () => {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const collection = mongoose.connection.db.collection('users');

    console.log('🗑️ Dropping all existing indexes...');
    await collection.dropIndexes();
    console.log('✅ Indexes dropped');

    console.log('🔨 Creating new indexes...');
    
    // 1. Create email index with collation
    await collection.createIndex(
      { email: 1 },
      {
        name: 'email_1',
        unique: true,
        collation: { locale: 'en', strength: 2 }
      }
    );

    // 2. Create verification token index
    await collection.createIndex(
      { emailVerificationToken: 1 },
      {
        name: 'email_verification_token_idx',
        background: true,
        partialFilterExpression: { emailVerificationToken: { $exists: true } }
      }
    );

    // 3. Create password reset token index
    await collection.createIndex(
      { resetPasswordToken: 1 },
      {
        name: 'reset_password_token_idx',
        background: true,
        partialFilterExpression: { resetPasswordToken: { $exists: true } }
      }
    );

    console.log('✅ New indexes created');
    
    // Verify
    const indexes = await collection.indexes();
    console.log('\n🎉 Final Index Configuration:');
    indexes.forEach(index => {
      console.log(`- ${index.name}:`, {
        unique: index.unique || false,
        collation: index.collation || 'none',
        partial: index.partialFilterExpression ? 'yes' : 'no'
      });
    });

    process.exit(0);
  } catch (err) {
    console.error('❌ Fix failed:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
};

forceFixIndexes();