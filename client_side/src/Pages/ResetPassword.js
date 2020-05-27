import React,{useState,useContext} from 'react';
import {Link, useHistory } from 'react-router-dom';
import M from 'materialize-css';

const ResetPassword = () => {
    const history = useHistory();
    const[email,setEmail] = useState("");

    const PostData=()=>{
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "Invalid Email!",classes:"#b71c1c red darken-4"});
            return
        } 
            fetch("/resetpassword",{
                method:"post",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    email:email,
                })
            }).then(res=>res.json())
                .then(data=>{
                    if(data.error){
                        M.toast({html: data.error,classes:"#b71c1c red darken-4"});
                    } 
                    else {
                        M.toast({html:data.message,classes:"#64dd17 light-green accent-4"});
                        history.push("/signin ");
                    }
                }).catch(error=>{
                    console.log(error);
                })
    }

    return (
        <>
            <div className="my-card">
                <div className="card auth-card input-field">
                    <h2 className="auth-title">SHUTTER</h2>
                    <input
                        type="text"
                        placeholder="email"
                        value={email}
                        onChange={(e)=>{setEmail(e.target.value)}}
                    />
                    <button onClick={()=>PostData()} className="waves-effect waves-light btn red lighten-1">Reset Password</button>
                </div>
            </div>
        </>
    )
}

export default ResetPassword