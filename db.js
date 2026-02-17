const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB connected ${process.env.MONGO_URL}`);

  } catch (err) {
    console.error('Mongo error:', err.message);
  }
};

module.exports = connectDb;
