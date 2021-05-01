import React,{useState,useEffect} from "react";
import {useHistory} from "react-router-dom";
import M from "materialize-css"

function Createpost(){
   const [caption,setCaption]=useState("");
   const [image,setImage]=useState("");
   const [url,setUrl]=useState("");
   const history=useHistory();
   
  useEffect(()=>{
  if(url){
    fetch("/createpost",{
    method:"post",
    headers:{
       "Content-Type":"application/json"
    },
    body:JSON.stringify({
      caption,
      pic:url
    })
 }).then(res => res.json())
 .then(data => {
    if(data.error){M.toast({html:data.error,classes:"red darken-3"})}
    else{
       M.toast({html:"Created post succesfully",classes:"green darken-1"});
       history.push("/");
   }
 });
  }
  },[url]);

   function postData(){
     const data=new FormData();
     data.append("file",image);
     data.append("upload_preset","insta-clone");
     data.append("cloud_name","sanyammehta06");
     fetch("https://api.cloudinary.com/v1_1/sanyammehta06/image/upload",{
       method:"post",
       body:data
     })
     .then(res=>res.json())
     .then(data=>setUrl(data.url))
     .catch(err=>console.log(err))
    
   }

    return (<div className="card create-card input-field">
        <input 
         type="text"
         placeholder="Add Caption"
          value={caption}
          onChange={(e)=>setCaption(e.target.value)}
         />
        <div className="file-field input-field">
      <div className="btn blue darken-1">
        <span>Upload</span>
        <input
         type="file"
         onChange={(e)=>setImage(e.target.files[0])} />
      </div>
      <div className="file-path-wrapper">
        <input className="file-path validate" type="text" />
      </div>
    </div>
    <button className="btn waves-effect waves-light blue darken-1" onClick={postData}>Submit Post</button>
    </div>)
}

export default Createpost;