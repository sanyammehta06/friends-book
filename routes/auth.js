require('dotenv').config();
const express=require('express');
const router=express.Router();
const passport=require('passport');
const bcrypt = require('bcryptjs');
const User=require('../models/user');



router.post("/register",function(req,res){
    const {name,email,password}=req.body;
    if(!name || !email || !password){
        return res.status(422).json({error:"please add all the fields"})
    }
    else{
       User.findOne({email:email})
       .then(function(user){
            if(user){
              res.json({error:"user already exists"})
            }
            if(!user){
              bcrypt.hash(password,parseInt(process.env.SALT_ROUNDS))
              .then(hashedpassword=>{
                const user=new User({
                  name,
                  email:email,
                  password:hashedpassword
                })
               user.save()
               .then((user)=> res.json({message:"saved successfully"}))
               .catch(err=>{console.log(err);})
              })
              .catch(err=>console.log(err))
            }
       })
       .catch(function(err){console.log(err);})
    }
  });



router.post('/login', function(req, res, next) {
    const {email,password}=req.body;
    if( !email || !password){
        return res.status(422).json({error:"please add all the fields"})
    }
  passport.authenticate('local', function(err, user, info) {

    if (err) { console.log(err); return next(err); }
    if (!user) { return res.status(422).json({error:"invalid email or password"}); }
    else{
    req.logIn(user, function(err) {
      if (err) { 
        console.log(err);
      return;
     }
      else{
        user.password=undefined;
       res.json({message:"success",user});
      }
    });
  }
})(req,res,next)
})

router.get('/logout', function(req, res){
  req.logout();
});

module.exports=router;