import React,{useState,useContext} from 'react';
import {Link, useHistory, useParams } from 'react-router-dom';
import M from 'materialize-css';

const NewPassword = () => {
    const history = useHistory();
    const[password,setPassword] = useState("");
    const {token} = useParams();
    console.log(token);

    const PostData=()=>{

            fetch("/newpassword",{
                method:"post",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    password:password,
                    token:token
                })
            }).then(res=>res.json())
                .then(data=>{
                    console.log(data)
                    if(data.error){
                        M.toast({html: data.error,classes:"#b71c1c red darken-4"});
                    } 
                    else {
                        M.toast({html:data.message,classes:"#64dd17 light-green accent-4"});
                        history.push("/signin");
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
                        type="password"
                        placeholder="enter new password"
                        value={password}
                        onChange={(e)=>{setPassword(e.target.value)}}
                    /> 
                    <button onClick={()=>PostData()} className="waves-effect waves-light btn red lighten-1">Update Password</button>
                </div>
            </div>
        </>
    )
}

export default NewPassword