import React,{useContext} from "react";
import {Link, useHistory} from 'react-router-dom'
import {UserContext} from './App';

function Navbar(){
  const {state,dispatch}=useContext(UserContext);
  const history=useHistory();
   function renderList(){
     if(state){
      return [
        <li><Link to="/explore">Explore</Link></li>,
      <li><Link to="/profile">Profile</Link></li>,
      <li><Link to="/createpost">Create Post</Link></li>,
    <li> <button onClick={()=>{
      fetch('/logout')
      localStorage.clear();
      dispatch({type:"CLEAR"});
      history.push("/");
    }} className="btn red darken-3">Logout</button></li>]
     }
     else{
       return [<li><Link to="/register">Signup</Link></li>,
       <li><Link to="/login">Login</Link></li>]
     }
   }
    return (<nav>
    <div className="nav-wrapper white">
      <Link to="/" className="brand-logo left">Friends Book</Link>
      <ul id="nav-mobile" className="right">
       {renderList()}
      </ul>
    </div>
  </nav>);
}

export default Navbar;