import mongoose from 'mongoose';
import User from './models/userModel.js';
import dotenv from 'dotenv';

dotenv.config();

const verifyIndexes = async () => {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 30000
    });
    console.log('✅ Connected to MongoDB');

    console.log('🔍 Checking database indexes...');
    const indexes = await User.collection.indexes();
    
    // Required index configurations
    const requiredIndexes = [
      {
        name: 'email_1',
        checks: {
          unique: true,
          collation: { locale: 'en', strength: 2 }
        }
      },
      {
        name: 'email_verification_token_idx',
        checks: {
          partialFilterExpression: { emailVerificationToken: { $exists: true } }
        }
      },
      {
        name: 'reset_password_token_idx',
        checks: {
          partialFilterExpression: { resetPasswordToken: { $exists: true } }
        }
      }
    ];

    console.log('\nCurrent Indexes:');
    console.table(indexes.map(i => ({
      name: i.name,
      unique: i.unique || false,
      collation: i.collation ? `${i.collation.locale}-${i.collation.strength}` : 'none',
      partial: i.partialFilterExpression ? 'yes' : 'no'
    })));

    let allValid = true;
    
    for (const reqIndex of requiredIndexes) {
      const index = indexes.find(i => i.name === reqIndex.name);
      
      if (!index) {
        console.error(`❌ Missing index: ${reqIndex.name}`);
        allValid = false;
        continue;
      }

      for (const [key, expected] of Object.entries(reqIndex.checks)) {
        const actual = index[key];
        if (JSON.stringify(actual) !== JSON.stringify(expected)) {
          console.error(`❌ Invalid ${key} for index ${reqIndex.name}`);
          console.error(`   Expected: ${JSON.stringify(expected)}`);
          console.error(`   Actual:   ${JSON.stringify(actual)}`);
          allValid = false;
        }
      }
    }

    if (allValid) {
      console.log('\n✅ All indexes are properly configured');
    } else {
      console.log('\n🚨 Some indexes need correction');
      console.log('Run the migration script to fix:');
      console.log('node migrations/fixIndexes.js');
    }
    
    process.exit(allValid ? 0 : 1);
  } catch (err) {
    console.error('\n❌ Verification failed:');
    console.error(err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
};

verifyIndexes();