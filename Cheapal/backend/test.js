import mongoose from 'mongoose';

const uri = "mongodb+srv://reachoutimrankhan:GoC1xc5bgxZdZnIl@cheapal.eua8gbv.mongodb.net/cheapal";

async function testDB() {
  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB Connected");
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("📦 Collections:", collections.map(c => c.name));
  } catch (err) {
    console.error("❌ DB Error:", err.message);
  } finally {
    mongoose.disconnect();
  }
}

testDB();