const jwt = require("jsonwebtoken")
require("dotenv").config()

const generatetoken = (userdata) =>{
    return jwt.sign(userdata,process.env.JWT_SECRET)
}

const authmiddleware = (req,res,next)=>{
    const authorization = req.headers.authorization
    if(!authorization) return res.status(404).json({error : "tokennot found"})

        const token = req.headers.authorization.split(" ")[1]
        if(!token) return res.status(404).json({error : "unathorization"})

            try {
                const decode = jwt.verify(token,process.env.JWT_SECRET)
                req.user = decode
                next()
            } catch (error) {
                console.log(error);
                
            }
}

module.exports = {generatetoken,authmiddleware}