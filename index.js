const express = require("express")
const app = express()
require("dotenv").config()
const cors = require("cors")
const authRoutes = require("./routes/authRoutes")
const connection = require("./config/db")


//middlewares
app.use(express.json())
app.use(cors())


//routes
app.use("/api/auth",authRoutes)



app.listen(process.env.port,async()=>{
    connection()
    console.log(`server running on port:${process.env.port}`)
})