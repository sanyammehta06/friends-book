import React,{useEffect,createContext,useReducer,useContext} from 'react';
import Navbar from './Navbar';
import {BrowserRouter,Route, Switch, useHistory} from 'react-router-dom';
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import Profile from "./Profile";
import UserProfile from "./UserProfile";
import Createpost from "./Createpost";
import {initialState,userReducer} from "../reducers/userReducer";
import Explore from './Explore';
export const UserContext=createContext();

function Routing(){
  const history=useHistory();
  const {state,dispatch}=useContext(UserContext);
  
  useEffect(()=>{
         async function checkUser(){
          const user=await JSON.parse(localStorage.getItem("user"));
            await dispatch({type:"USER",payload:user});
            if(!user){
       history.push("/login");
            }
         }
         checkUser();
    },[]);
    
  return(
    
    <Switch>
     <Route exact path="/">
     {state? <Home />:<Login />}
     </Route>
     <Route path="/register">
    <Register />
    </Route>
    <Route path="/login">
    <Login />
    </Route>
    <Route exact path="/profile">
    <Profile />
    </Route>
    <Route path="/createpost">
    <Createpost />
    </Route>
    <Route path="/profile/:id">
    <UserProfile />
    </Route>
    <Route path="/explore">
    <Explore />
    </Route>
    </Switch>
  )
}

function App() {
  const [state,dispatch]=useReducer(userReducer,initialState);

  return (
    <UserContext.Provider value={{state,dispatch}}>
    <BrowserRouter>
    <Navbar />
    <Routing />
  </BrowserRouter>
  </UserContext.Provider>
  );
}

export default App;
