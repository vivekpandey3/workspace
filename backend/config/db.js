import mongoose from "mongoose"
const connectDB= async()=>{
  try{

    await mongoose.connect(process.env.MONGO_URI)
    console.log("your saas database is also connected")

  }
  catch(error){
    console.log(error,"database connection failed here")
  }
} 

export default connectDB