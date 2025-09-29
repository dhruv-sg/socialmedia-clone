const express = require("express")
const router = express.Router()
const User = require("../model/userSchema")
const {generatetoken,authmiddleware} = require("../auth")


router.post("/signup",async (req,res)=>{
    try{
        const data = req.body;

        const newUser = new User(data)
        const response = await newUser.save()

        const payload = {
            id:response.id,
            name:response.name,
            email:response.email,
            role:response.role
        }
        const token = generatetoken(payload)
        console.log("data saved");
        res.status(200).json({response,token})
        

    }catch(error){
        console.log(error);  
    }
})

router.get("/all",authmiddleware,async (req,res) => {
    try {
        if(req.user.role !== "admin"){
            return res.status(403).json({error : "access denied"})
        }
        const data  = await User.find()
        console.log("data fetched");
        res.status(200).json({data})
    } catch (error) {
        console.log(error);
        
    }
})

router.post("/login",async (req,res) => {
    try {
        const {email,password} = req.body;

        const data = await User.findOne({email:email})

        if(!data || !(await data.comparePassword(password))){
            return res.status(401).json({error : "invalid email or password"})
        }

        const payload = {
            id:data.id,
            name:data.name,
            email:data.email,
            role:data.role
        }
        const token = generatetoken(payload)

        console.log("login successfull");
        res.status(200).json({token})
        
    } catch (error) {
        console.log(error);
        
    }
})

module.exports = router