import React, { useEffect, createContext, useReducer,useContext } from 'react';
import { BrowserRouter as Router, Route, Switch, useHistory } from 'react-router-dom';
import { reducer, initialState } from './data/reducer/reducer';
import './App.css';

import NavBar from './components/NavBar';
import Home from './Pages/Home';
import Signin from './Pages/Signin';
import Profile from './Pages/Profile';
import Signup from './Pages/Signup';
import CreatePost from './Pages/CreatePost';
import UsersProfile from './Pages/UsersProfile';
import SubscribedUserPosts from './Pages/SubscribedUserPosts';
import ResetPassword from './Pages/ResetPassword';
import NewPassword from './Pages/NewPassword';


//Have to use useReducer with createContext-this now allows
export const UserContext = createContext()

//moved Routes into serprated function for useHistory

const Routing = () => {
  const history = useHistory();
  const {state,dispatch} = useContext(UserContext);
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"));
   if(user){
     dispatch({type:"USER",payload:user})
   } else {
     if(!history.location.pathname.startsWith('/resetpassword')){
      history.push("/signin")
     }
   }
  },[])
  return(
    <Switch>
      <Route exact path="/">
        <Home/>
      </Route>
      <Route path="/signin">
        <Signin/>
      </Route>
      <Route exact path="/profile">
        <Profile/>
      </Route>
      <Route path="/signup">
        <Signup/>
      </Route>
      <Route path="/createpost">
        <CreatePost/>
      </Route>
      <Route path="/profile/:userid">
        <UsersProfile/>
      </Route>
      <Route path="/mysubscribedposts">
        <SubscribedUserPosts/>
      </Route>
      <Route exact path="/resetpassword">
        <ResetPassword/>
      </Route>
      <Route path="/resetpassword/:token">
        <NewPassword/>
      </Route>
  </Switch>
  )
}

function App() {
  const [state,dispatch] = useReducer(reducer,initialState);
  return (
    <UserContext.Provider value={{state:state,dispatch}}>
    <Router>
      <NavBar/>
      <Routing/>
    </Router>
    </UserContext.Provider>
  );
}

export default App;
