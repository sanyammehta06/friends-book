require('dotenv').config();
const express=require('express');
const app=express();
const mongoose=require('mongoose');
const session=require('express-session');
const passport=require('passport');
const bodyParser=require('body-parser');
const LocalStrategy=require('passport-local').Strategy;
const bcrypt=require('bcryptjs');
const User=require('./models/user');


passport.checkAuthentication= function(req, res, next) {
    if (req.isAuthenticated()) return next();
    else {
      res.json({error:"you must be logged in"})
}
}

app.use(express.json());
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(express.static(__dirname + '/public'));

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended : false}));
passport.use(new LocalStrategy(
	{
		usernameField: 'email',
        passwordField: 'password'
	},
	function(username, password, done) {
    User.findOne({ email: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false);
      }
     bcrypt.compare(password,user.password,function(err,result){
       if(err){throw err;}
       if(result===true){
         return done(null,user)
       }else{
         return done(null,false)
       }
     })
    });
  }
));
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));


mongoose.connect(process.env.MONGODB_URL,{ useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify:false });
mongoose.set("useCreateIndex",true);
mongoose.connection.on("connected",()=>console.log("mongodb connected"));
mongoose.connection.on("error",(err)=>console.log(err));

if(process.env.NODE_ENV=='production'){
  app.use(express.static('client/build'));
  const path=require('path');
  app.get("*",(req,res)=>{
res.sendFile(path.resolve(__dirname,'client','build','index.html'))
  })
}

app.listen(process.env.PORT || 5000,()=>{
    console.log("Server is running");
});

