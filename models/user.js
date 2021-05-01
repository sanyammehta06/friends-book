const mongoose=require('mongoose');
const {ObjectId}=mongoose.Schema.Types;
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
       unique: true
    },
    password:{
        type:String
        },
    followers:[{
        type:ObjectId,
        ref:"User"
    }],
    following:[{
        type:ObjectId,
        ref:"User"
    }],
    pic:{
        type:String,
        default:"https://res.cloudinary.com/sanyammehta06/image/upload/v1618039134/blank-profile-picture-973460_1280_dfm0pp.webp"
    }
});
module.exports=mongoose.model("User",userSchema);