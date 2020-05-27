import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../App';

const Profile = () => {
    const [dataUserPics, setDataUserPics] = useState([]);
    const { state, dispatch } = useContext(UserContext);
    const [profilePic, setProfilePic] = useState("");
    const [isShown, setIsShown] = useState(false);
    const [changePic, setChangePic] = useState(false);
    // const [url, setUrl] = useState("");

    console.log(state)


    useEffect(() => {
        fetch('/mypost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(data => {
                if (!data.error) {
                    // console.log(data);
                    setDataUserPics(data.mypost)
                }
            })
    }, [])

    useEffect(() => {
        if (profilePic) {
            const data = new FormData();
            data.append("file", profilePic);
            data.append("upload_preset", "photostory");
            data.append("cloud_name", "papenwors01");
            fetch("https://api.cloudinary.com/v1_1/papenwors01/image/upload", {
                method: "post",
                body: data
            })
                .then(res => res.json())
                .then(data => {
                    // setUrl(data.url);
                    console.log(data)
                    // localStorage.setItem("user",JSON.stringify({...state,profilePic:data.url}));
                    // dispatch({type:"UPDATEPPIC", payload:data.url})
                    fetch('/updateProfilePic', {
                        method: "put",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + localStorage.getItem("jwt")
                        },
                        body: JSON.stringify({
                            profilePic: data.url
                        })
                    }).then(res => res.json())
                        .then(result => {
                            console.log(result);
                            localStorage.setItem("user", JSON.stringify({ ...state, profilePic: result.profilePic }));
                            dispatch({ type: "UPDATEPPIC", payload: result.profilePic })
                        })
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }, [profilePic])

    const updateProfilePic = (file) => {
        setProfilePic(file)
        setChangePic(false)
    }

    return (
        <>
            {state && dataUserPics ? <div className="profile-wrap">
                <div className="upp-profile-wrapper">
                
                    {changePic ?
                        <div className="update-pic file-field input-field">
                            <div class="waves-effect waves-light btn cyan lighten-2">
                                <span>Update Picture
                                                        <input
                                        type="file"
                                        onChange={(e) => { updateProfilePic(e.target.files[0]) }}
                                    />
                                </span>
                            </div>
                            <div className="file-path-wrapper">
                                <input className="file-path validate" type="text" />
                            </div>
                        </div>
                        : 
                        <img className="profile-pic-img"
                            src={state.profilePic}
                            onMouseEnter={() => setIsShown(true)}
                            onMouseLeave={() => setIsShown(false)}
                            onClick={()=>setChangePic(true)}
                         />
                    }
                    
                    
                    <div>
                        
                        <h4>
                            {state.name}
                        </h4>
                        <div className="profile-stats">
                            <h6>{dataUserPics.length} Posts</h6>
                            <h6>{state ? state.followers.length : "0"} Followers</h6>
                            <h6>{state ? state.following.length : "0"} Following</h6>
                        </div>
                        {isShown && (<h6><strong>Change Profile Picture</strong></h6>)}
                    </div>

                </div>
                <div className="gallery">
                    {dataUserPics.map((item, index) => {
                        return <img key={index} className="gallery-img" src={item.photo} />
                    })}
                </div>
            </div>
                : <p>"Loading"</p>}
        </>
    )
}

export default Profile

// const [isShown, setIsShown] = useState(false);

// return (
//     <div className="App">
//         <button
//             onMouseEnter={() => setIsShown(true)}
//             onMouseLeave={() => setIsShown(false)}>
//             Hover over me!
//       </button>
//         {isShown && (
//             <div>
//                 I'll appear when you hover over the button.
//             </div>
//         )}
//     </div>