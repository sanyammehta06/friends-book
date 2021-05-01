import React,{useState,useContext} from "react";
import {Link,useHistory} from "react-router-dom";
import M from "materialize-css"
import {UserContext} from "./App";

function Login(){

  const {state,dispatch}=useContext(UserContext); 
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const history=useHistory();
  function postData(){
 fetch("/login",{
    method:"post",
    headers:{
       "Content-Type":"application/json"
    },
    body:JSON.stringify({email,password})
 }).then(res => res.json())
 .then(data => {
    if(data.error){M.toast({html:data.error,classes:"red darken-3"})}
    else{
       localStorage.setItem("user",JSON.stringify(data.user));
       dispatch({type:"USER",payload:data.user});
       M.toast({html:data.message,classes:"green darken-1"});
       history.push("/explore");
   }
 });
  }
 return (
 <div className="myCard">
<div className="card auth-card input-field">
     <h2>Friends Book</h2>
   <input
    type="email"
    placeholder="email"
    name="email"
    value={email}
    autoComplete="off"
    onChange={(e)=>setEmail(e.target.value)}
    required
    />
    <input
    type="password"
    placeholder="password"
    value={password}
    onChange={(e)=>setPassword(e.target.value)}
    name="password"
    required
    />
    <button onClick={postData} className="btn waves-effect waves-light blue darken-1">Login</button>
       <h5>
       <Link to="/register">Don't have an account ?</Link>
       </h5>
 </div>
 </div>
 )
}

export default Login;