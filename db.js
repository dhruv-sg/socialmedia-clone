const mongoose = require("mongoose")

const URL = 'mongodb+srv://admin:hellodhruv@votingapp.fle2nxm.mongodb.net/practice-28sept'

mongoose.connect(URL)

const db = mongoose.connection
db.on("connected",()=>{
    console.log("DB connected");
    
})

module.exports= db