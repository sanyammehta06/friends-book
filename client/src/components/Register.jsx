import React,{useState} from "react";
import {Link,useHistory} from "react-router-dom";
import M from "materialize-css";

function Register(){
   const [name,setName]=useState("");
   const [email,setEmail]=useState("");
   const [password,setPassword]=useState("");
   const history=useHistory();
   function postData(){
      if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
         M.toast({html:"invalid email",classes:"red darken-3"});
         return;
      }
    fetch("/register",{
       method:"post",
       headers:{
          "Content-Type":"application/json"
       },
       body:JSON.stringify({name,email,password})
    }).then(res => res.json())
    .then(data => {
       if(data.error){M.toast({html:data.error,classes:"red darken-3"})}
       else{
          M.toast({html:data.message,classes:"green darken-1"});
          history.push("/login");
      }
    });
   }
    return (
 <div className="myCard">
<div className="card auth-card input-field">
     <h2>Friends Book</h2>
     
     <input
    type="text"
    name="name"
    placeholder="name"
    value={name}
    autoComplete="off"
    onChange={(e)=>setName(e.target.value)}
    />
   <input
    type="email"
    name="email"
    placeholder="email"
    autoComplete="off"
    value={email}
    onChange={(e)=>setEmail(e.target.value)}
    />
    <input
    type="password"
    name="password"
    placeholder="password"
    autoComplete="new-password"
    value={password}
    onChange={(e)=>setPassword(e.target.value)}
    />
    <button onClick={postData} className="btn waves-effect waves-light blue darken-1">Sign Up</button>
       <h5>
       <Link to="/login">Already have an account ?</Link>
       </h5>
 </div>
 </div>
 )
}

export default Register;