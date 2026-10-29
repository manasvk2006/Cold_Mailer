import mongoose from "mongoose"


const connectDB = async()=> {
    try{
        const connection = await mongoose.connect(process.env.MONGO_URL)
        console.log("MongoDB Connected")
    }
    catch(e){
        console.log("ERROR connection to MongoDB: ",e.message) 

    }
}

export default connectDB