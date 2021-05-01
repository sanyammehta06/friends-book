const express=require('express');
const router=express.Router();
const passport=require('passport');
const Post=require("../models/post");
const User=require("../models/user");

router.get("/user/:userId",passport.checkAuthentication,function(req,res){
 
 User.findOne({_id:req.params.userId}).select("-password").then(user=>{
        Post.find({postedBy:req.params.userId}).populate("postedBy","_id name").exec((err,posts)=>{
            if(err){
                res.json({error:err});
            }
            else{
                res.json({user,posts});
            }
        })
    }).catch(err=>{
     res.status(404).json({error:"user not found"});
    })
});

router.put("/follow",passport.checkAuthentication,function(req,res){
  User.findByIdAndUpdate(req.body.followId,{
      $push:{followers:req.user._id}
  },{new:true},(err,result)=>{
    if(err){
        res.status(422).json({error:err})
    }
    User.findByIdAndUpdate(req.user._id,{
        $push:{following:req.body.followId}
    },{new:true}).select("-password").then(result=>{
      res.json(result);
    }).catch(err=>{
        res.status(422).json({error:err})
    });
  });
});


router.put("/unfollow",passport.checkAuthentication,function(req,res){
    User.findByIdAndUpdate(req.body.unfollowId,{
        $pull:{followers:req.user._id}
    },{new:true},(err,result)=>{
      if(err){
          res.status(422).json({error:err})
      }
      User.findByIdAndUpdate(req.user._id,{
          $pull:{following:req.body.unfollowId}
      },{new:true}).select("-password").then(result=>{
        res.json(result);
      }).catch(err=>{
          res.status(422).json({error:err})
      });
    });
  });

  router.put("/updatepic",passport.checkAuthentication,function(req,res){
    User.findByIdAndUpdate(req.user._id,{
        $set:{pic:req.body.pic}
    },{new:true},(err,result)=>{
      if(err){
          res.status(422).json({error:err})
      }
      else
      {
          res.json(result);
      }
  });
});
module.exports=router;