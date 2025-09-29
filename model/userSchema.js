const mongoose = require('mongoose')
const bcrypt = require("bcrypt")
const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,"name is required"],
        },
        email:{
            type:String,
            required:[true,"email is required"],
            unique:true,
            lowercase:true,
        },
        password:{
            type:String,
            required:[true,"password is required"],
            minlength:[6,"password must be at least 6 char long"]
        },
        role:{
            type:String,
            enum:["user","admin"],
            default:"user"
        },
    },
    {timestamps:true}
)

userSchema.set("toJSON",{
    transform:function(doc,ret){
        ret.createdAt = new Date(ret.createdAt).toLocaleString();
        ret.updatedAt = new Date(ret.updatedAt).toLocaleString();
        return ret;
    }
})

userSchema.pre("save",async function (next) {
    if(!this.isModified("password")) return next()

        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password,salt)
})

userSchema.methods.comparePassword = async function (userpassword) {
    try {
        isMatch = await bcrypt.compare(userpassword,this.password)
        return isMatch
    } catch (error) {
        console.log(error);
        
    }
}

module.exports= mongoose.model("User",userSchema)