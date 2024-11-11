const mongoose = require('mongoose');
const dotenv = require('dotenv');


dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log("MongoDB Connection Successful ");
  } catch (error) {
    console.error(" MongoDB Connection Failed：", error);
    process.exit(1);
  }
};

module.exports = connectDB;

