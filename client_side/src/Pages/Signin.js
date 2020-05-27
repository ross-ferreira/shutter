import React,{useState,useContext} from 'react';
import {Link, useHistory } from 'react-router-dom';
import {UserContext} from '../App'
import M from 'materialize-css';

const Signin = () => {
    const {state,dispatch} = useContext(UserContext);
    const history = useHistory();
    const[password,setPassword] = useState("");
    const[email,setEmail] = useState("");

    const PostData=()=>{
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "Invalid Email!",classes:"#b71c1c red darken-4"});
            return
        } 
            fetch("/signin",{
                method:"post",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    email:email,
                    password:password
                })
            }).then(res=>res.json())
                .then(data=>{
                    console.log(data)
                    if(data.error){
                        M.toast({html: data.error,classes:"#b71c1c red darken-4"});
                    } 
                    else {
                        //add local storage for token for authlogin
                        localStorage.setItem("jwt",data.token);
                        localStorage.setItem("user",JSON.stringify(data.user));
                        dispatch({type:"USER",payload:data.user});
                        M.toast({html:"Signed in Successfully",classes:"#64dd17 light-green accent-4"});
                        history.push("/");
                    }
                }).catch(error=>{
                    console.log(error);
                })
    }

    return (
        <>
            <div className="my-card">
                <div className="card auth-card input-field">
                    <h2 className="brand-logo">SHUTTER</h2>
                    <input
                        type="text"
                        placeholder="email"
                        value={email}
                        onChange={(e)=>{setEmail(e.target.value)}}
                    />
                    <input
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={(e)=>{setPassword(e.target.value)}}
                    /> 
                    <button onClick={()=>PostData()} className="waves-effect waves-light btn cyan lighten-2">Signin</button>
                    <h5>
                        <Link to="/signup">
                            Don't have an account?
                        </Link>
                    </h5>
                    <h6>
                        <Link to="/resetpassword">
                            Forgot Password?
                        </Link>
                    </h6>
                </div>
            </div>
        </>
    )
}

export default Signin