const mongoose = require('mongoose')

module.exports.connectDB = async () => {
  const uri = process.env.MONGO_URI
  if (!uri) {
    console.error(
      'MongoDB: MONGO_URI is not set. Add it to backend/.env (e.g. from MongoDB Atlas).'
    )
    process.exit(1)
  }
  try {
    await mongoose.connect(uri)
    console.log('MongoDB Connected')
  } catch (error) {
    console.error(error.message)
    process.exit(1)
  }
}