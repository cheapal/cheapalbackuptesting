// server/models/Test.js
const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  name: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Test', testSchema);
