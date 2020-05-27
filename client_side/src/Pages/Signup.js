import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import M from 'materialize-css';

const SignUp = () => {

    const history = useHistory();
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [profilePic, setProfilePic] = useState(null);
    const [url, setUrl] = useState(undefined);

    useEffect(()=>{
        if(url){
            uploadSignupFields();
        }
    },[url])


    const uploadProfilePic = () =>{
        const data = new FormData();
        data.append("file", profilePic);
        data.append("upload_preset", "profile_images_photostory");
        data.append("cloud_name", "papenwors01");
        fetch("https://api.cloudinary.com/v1_1/papenwors01/image/upload", {
            method: "post",
            body: data
        })
            .then(res => res.json())
            .then(data => {
                setUrl(data.url);
            })
            .catch(err => {
                console.log(err)
            })
    }

    const uploadSignupFields =() => {
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            M.toast({ html: "Invalid Email!", classes: "#b71c1c red darken-4" })
            return
        }
        fetch("/signup", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password,
                profilePic: url
            })
        }).then(res => res.json())
            .then(data => {
                if (data.error) {
                    M.toast({ html: data.error, classes: "#b71c1c red darken-4" })
                }
                else {
                    M.toast({ html: data.message, classes: "#64dd17 light-green accent-4" })
                    history.push("/signin")
                }
            }).catch(error => {
                console.log(error)
            })
    }
    const PostData = () => {
        if(profilePic){
            uploadProfilePic();
        }else{
            uploadSignupFields();
        }


        // Have to remove https:localhost:5000 from fetch() due to CORS error
        //add proxy to package.json under main object header
        //proxys forward to wherver we want to send requests
    }
    return (
        <>
            <div className="my-card">
                <div className="card auth-card input-field">
                    <h2 className="brand-logo">SHUTTER</h2>
                    <input
                        type="text"
                        placeholder="name"
                        value={name}
                        onChange={(e) => { setName(e.target.value) }}
                    />
                    <input
                        type="text"
                        placeholder="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value) }}
                    />
                    <input
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value) }}
                    />
                    <div class="file-field input-field">
                        <div class="waves-effect waves-light btn red lighten-1">
                            <span>Upload Image</span>
                            <input type="file"
                                // value={body}
                                onChange={(e) => { setProfilePic(e.target.files[0]) }}
                            />
                        </div>
                        <div class="file-path-wrapper">
                            <input class="file-path validate" type="text" />
                        </div>
                    </div>
                    <button onClick={() => { PostData() }} className="waves-effect waves-light btn cyan lighten-2">Sign Up</button>
                    <h5>
                        <Link to="signin">
                            Already have an account?
                        </Link>
                    </h5>
                </div>
            </div>
        </>
    )
}

export default SignUp