import React,{ useEffect,useState,useContext } from "react";
import {UserContext} from "./App";
import {useParams} from 'react-router-dom';
function Profile(){
    const {id}=useParams();
    const [userProfile,setProfile]=useState(null);
     const {state,dispatch}=useContext(UserContext);
     const [showFollow,setFollow]=useState(state?!state.following.includes(id):true);

     useEffect(()=>{
         async function fetchData(){
       const res= await fetch(`/user/${id}`);
      const result=await res.json(); 
           await setProfile(result);
         }
         fetchData();
    },[])

    function followUser(){
        fetch('/follow',{
            method:"put",
            headers:{
                "Content-Type":"application/json"
             },
             body:JSON.stringify({followId:id})
          }).then(res=>res.json())
            .then(result=>{
                dispatch({type:"UPDATE",payload:{followers:result.followers,following:result.following}});
                localStorage.setItem("user",JSON.stringify(result));
                setProfile((prev)=>{
                    return {
                        ...prev,
                        user:{...prev.user,followers:[...prev.user.followers,result._id]}
                    }
                });
                setFollow(false);
            });
        }
        function unFollowUser(){
        fetch('/unfollow',{
            method:"put",
            headers:{
                "Content-Type":"application/json"
             },
             body:JSON.stringify({unfollowId:id})
          }).then(res=>res.json())
            .then(result=>{
                dispatch({type:"UPDATE",payload:{followers:result.followers,following:result.following}});
                localStorage.setItem("user",JSON.stringify(result));
                setProfile((prev)=>{
                    const newfollowers=prev.user.followers.filter(item=>{return item!=result._id});
                    return {
                        ...prev,
                        user:{...prev.user,followers:newfollowers}
                    }
                });
                setFollow(true);
            });
        }    

 return (
     <>
     {userProfile?
 <div style={{maxWidth:"550px",margin:"0px auto"}}>
     <div className="profile">
     <div>
         <img className="profile-img" src={userProfile.user.pic} alt="profileimage"/>
     </div>
     <div className="profile-content">
     <h4>{userProfile.user.name}</h4>
     <h5>{userProfile.user.email}</h5>
         <div style={{display:"flex",justifyContent:"space-between", width:"108%"}}>
          <h6>{userProfile.posts.length} posts</h6>
          <h6>{userProfile.user.followers.length} followers</h6>
          <h6>{userProfile.user.following.length} following</h6>
         </div>
         {showFollow?
         <button onClick={followUser} style={{margin:"10px"}} className="btn waves-effect waves-light blue darken-1">FOLLOW</button>:
         <button onClick={unFollowUser} style={{margin:"10px"}} className="btn waves-effect waves-light blue darken-1">UNFOLLOW</button>
         }
     </div>
     </div>
     <div className="gallery">
     {
         userProfile.posts.map(item=>{
            return <img className="item" src={item.photo} key={item._id} alt={item.caption}/>
         })
     }
          
     </div>
    
 </div>:<h2>loading...</h2>}
 </>
    )
}

export default Profile;