import React,{ useEffect,useState,useContext } from "react";
import { Link } from "react-router-dom";
import {UserContext} from "./App";

function Profile(){
    const [mypics,setpics]=useState([]);
    const [image,setImage]=useState("");
     const {state,dispatch}=useContext(UserContext);
     useEffect(()=>{
         async function fetchData(){
       const res= await fetch('/myposts');
      const result=await res.json(); 
           await setpics(result);
         }
         fetchData();
    },[])

    useEffect(()=>{
      if(image){
        const data=new FormData();
     data.append("file",image);
     data.append("upload_preset","insta-clone");
     data.append("cloud_name","mern-dev");
     fetch("https://api.cloudinary.com/v1_1/mern-dev/image/upload",{
       method:"post",
       body:data
     })
     .then(res=>res.json())
     .then(data=>{
         fetch("/updatepic",{
             method:"put",
             headers:{
                "Content-Type":"application/json"
             },
             body:JSON.stringify({pic:data.url})
         }).then(res=>res.json())
            .then(result=>{
                localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}));
         dispatch({type:"UPLOADPIC",payload:result.pic});
            })
        })
     .catch(err=>console.log(err))
      }
    },[image]);

   function uploadPic(file){
       setImage(file);
   }

 return (
 <div style={{maxWidth:"550px",margin:"0px auto",fontSize:"20px"}}>
     <div className="profile">
     <div>
      <img className="profile-img" style={{"display":"block"}} src={state?state.pic:"loading"} alt="profileimage"/>
      <div className="file-field input-field" style={{margin:"20px 20px 20px 45px"}}>
      <div className="btn blue darken-1">
        <span>Update pic</span>
        <input
         type="file"
         onChange={(e)=>uploadPic(e.target.files[0])} />
      </div>
      <div className="file-path-wrapper" style={{maxWidth:"10px"}}>
        <input className="file-path validate" type="text" />
      </div>
    </div>
     </div>
     <div className="profile-content">
     <h4>{state?state.name:"loading"}</h4>
     <h5>{state?state.email:"loading"}</h5>
         <div style={{display:"flex",justifyContent:"space-between", width:"108%"}}>
          <h6>{mypics.length} posts</h6>
          <h6>{state?state.followers.length:"0"} followers</h6>
          <h6>{state?state.following.length:"0"} following</h6>
         </div>
     </div>
     </div>
     <div className="gallery">
     {
         mypics.map(item=>{
            return <img className="item" src={item.photo} key={item._id} alt={item.caption}/>
         })
     }
          
     </div>
    
 </div>
    )
}

export default Profile;