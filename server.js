const express = require("express")
const app = express()
const PORT  = 3000
const db = require('./db')
require("dotenv").config();


app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.get("/",(req,res)=>{
    res.send("<h1>hello WORLD<h1>")
})


const User = require("./routes/userRoute")
app.use("/user",User)

const post = require("./routes/postRoute")
app.use("/posts",post)


app.listen(PORT,()=>{
    console.log("server is started at " , PORT);
})