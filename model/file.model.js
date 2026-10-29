import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    fileName :{
        type : String,
        reqiured : true
    },
    fileURL :{
        type : String,
        reqiured : true
    },
    createdBy :{
        type : mongoose.Schema.Types.ObjectId,
        reqiured : true,
        ref: "User"
    }
})

const File = mongoose.model("File", fileSchema)
export default File