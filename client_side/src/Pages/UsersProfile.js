import React,{ useEffect, useState, useContext } from 'react';
import { UserContext } from '../App';
import {useParams} from 'react-router-dom';

const UsersProfile = () => {
    const [dataOthersPics, setDataOthersPics] = useState(null);
    const {state,dispatch} = useContext(UserContext);
    const {userid} = useParams();
    //we use the includes() method should give a boolean answer.. we allow for state loading
    const [showFollow,setShowFollow]= useState(state? !state.following.includes(userid):true);

    // console.log(state);
    // console.log(userid);

    useEffect(()=>{
        fetch(`/user/${userid}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                // console.log(result)
                setDataOthersPics(result);
            })
      },[])

      const followUser= () =>{
          fetch('/follow',{
            method:"put",
            headers: {
                "Content-Type":"application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                //userid from URL 
                followeeId: userid
            })
          }).then(res=>res.json())
          .then(data=>{
              console.log(data);
              dispatch({type:"UPDATE",payload:{
                  following:data.following,
                  followers:data.followers
              }})
              //can only store string in localstorage
              localStorage.setItem("user",JSON.stringify(data))
              //better to use call back function prevState
              setDataOthersPics((prevState)=>{
                  return{
                      ...prevState,
                      user:{
                          ...prevState.user,
                          followers:[...prevState.user.followers,data._id]
                      }
                  }
              });
              setShowFollow(false);
          })
      }

      const unFollowUser= () =>{
        fetch('/unfollow',{
          method:"put",
          headers: {
              "Content-Type":"application/json",
              "Authorization": "Bearer " + localStorage.getItem("jwt")
          },
          body:JSON.stringify({
              //userid from URL 
              unfolloweeId: userid
          })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data);
            dispatch({type:"UPDATE",payload:{
                following:data.following,
                followers:data.followers
            }})
            //can only store string in localstorage
            localStorage.setItem("user",JSON.stringify(data))
            //better to use call back function prevState
            setDataOthersPics((prevState)=>{
                const remFollower = prevState.user.followers.filter(item=>item !== data._id);
                return{
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:remFollower
                    }
                }
            });
            setShowFollow(true);
        })
    }

    return(

        <>
        { dataOthersPics ? <div className="profile-wrap">
            <div className="upp-profile-wrapper">
                <div>
                    <img className="profile-pic"
                    src={dataOthersPics.user.profilePic}
                    />
                </div>
                <div>
                    <h4>{dataOthersPics.user.name}</h4>
                    <h5>{dataOthersPics.user.email}</h5>
                    <div className="profile-stats">
                        <h6>{dataOthersPics.posts.length} Posts</h6>
                        <h6>{dataOthersPics.user.followers.length} Followers</h6>
                        <h6>{dataOthersPics.user.following.length} Following</h6>
                    </div>
                    {showFollow? 
                    <button onClick={()=>followUser()} className="waves-effect waves-light btn red lighten-1">Follow</button>:
                    <button onClick={()=>unFollowUser()} className="waves-effect waves-light btn red lighten-1">UnFollow</button>}
                    
                </div>
            </div>
            <div className="gallery">
                {dataOthersPics.posts.map((item,index)=>{
                  return <img key={index} className="gallery-img" src={item.photo}/>
                })}
            </div>
            {/* <p>{JSON.stringify(dataOthersPics.user)}</p> */}
        </div>
        : <p>"Loading"</p> }
        </>
    )
}

export default UsersProfile