require('dotenv').config();
const express=require('express');
const router=express.Router();
const passport=require('passport');
const Post=require("../models/post")


router.get("/explore",passport.checkAuthentication,function(req,res){
Post.find().populate("postedBy","_id name pic").populate("comments.postedBy","_id name").exec(function(err,posts){
    if(err){
        res.json({error:err})
    }else{
  res.json(posts);
    }
})
});

router.get("/posts",passport.checkAuthentication,function(req,res){
    Post.find({postedBy :{$in:[...req.user.following,req.user._id]}}).populate("postedBy","_id name pic").populate("comments.postedBy","_id name").exec(function(err,posts){
        if(err){
            res.json({error:err})
        }else{
      res.json(posts);
        }
    })
    });

router.post("/createpost",passport.checkAuthentication,function(req,res){
    const {caption,pic}=req.body;
    if(!caption || !pic){
        return res.status(422).json({error:"add all fields"})
    }
    req.user.password=undefined;
    const post=new Post({
        caption,
       photo:pic,
        postedBy:req.user
    });
    post.save(function(err,result){
        if(err){res.json({error:err})}
        else{res.json({post:result})}
    });
});


router.get("/myposts",passport.checkAuthentication,function(req,res){
 Post.find({postedBy:req.user._id}).populate("postedBy","_id name").exec(function(err,posts){
    if(err){
        res.json({error:err})
    }else{
  res.json(posts);
    }
})
});

router.put("/like",passport.checkAuthentication,function(req,res){
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likedBy:req.user._id}
    },{
        new:true
    }).populate("postedBy","_id name").exec(function(err,result){
        if(err){
            res.status(422).json({error:err})
        }else{
            res.json(result);
        }
    })
});

router.put("/unlike",passport.checkAuthentication,function(req,res){
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likedBy:req.user._id}
    },{
        new:true
    }).populate("postedBy","_id name").exec(function(err,result){
        if(err){
            res.status(422).json({error:err})
        }else{
            res.json(result);
        }
    })
});

router.put("/comment",passport.checkAuthentication,function(req,res){
    const comment={
        text:req.body.text,
        postedBy:req.user
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    }).populate("comments.postedBy","_id name")
    .populate("postedBy","_id name").exec(function(err,result){
        if(err){
            res.status(422).json({error:err})
        }else{
            res.json(result);
        }
    })
});

router.delete("/delete/:postId",passport.checkAuthentication,function(req,res){
  Post.findOne({_id:req.params.postId}).populate("postedBy","_id").exec(function(err,post){
      if(err || !post){
        res.status(422).json({error:err})   
      }
      if(post.postedBy._id.toString()===req.user._id.toString()){
          post.remove().then(result=>{
              res.json(result);
          }).catch(err=>console.log(err));
      }
  })
});
module.exports=router;