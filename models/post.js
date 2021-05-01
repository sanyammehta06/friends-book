const mongoose=require('mongoose');
const {ObjectId}=mongoose.Schema.Types;
const User = require('./user');
const postSchema=new mongoose.Schema({
     caption:{
        type:String,
        required:true
    },
    photo:{
        type:String,
        required:true
        },
    likedBy:[{
        type:ObjectId,
        ref:"User"
    }],
    comments:[
      {
          text:String,
          postedBy:{type:ObjectId,ref:"User"}
      }
    ],
    postedBy:{
        type:ObjectId,
        ref:"User"
    }
});
module.exports=mongoose.model("Post",postSchema);