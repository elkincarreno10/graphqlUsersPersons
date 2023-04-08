import mongoose from "mongoose"
import dotenv from 'dotenv'

dotenv.config()

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB')
}).catch(error => {
    console.error('error connection to MongoDB', error.message)
})




