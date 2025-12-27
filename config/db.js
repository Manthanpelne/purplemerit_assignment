const mongoose = require("mongoose")

const connection = async()=>{
    try {
        await mongoose.connect(process.env.MONGOURL )
        console.log("MongoDB connected")
    } catch (error) {
        console.error("error connecting DB",error)
        process.exit(1)
    }
}

module.exports = connection