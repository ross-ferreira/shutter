import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../App';
import M from 'materialize-css';
import {Link} from 'react-router-dom';

const SubscribedUserPosts = () => {
    const { state, dispath } = useContext(UserContext);
    const [dataImages, setDataImages] = useState([]);
    //Dont need to check if user has TOKEN- ALREADY Logged IN
    useEffect(() => {
        fetch('/subscribeposts ', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(data => {
                if (!data.error) {
                    console.log(data);
                    setDataImages(data.posts)
                }
            })
    }, [])

    const likePost = (id) => {
        fetch("/like", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                //updated the LIKED Picture only
                const newData = dataImages.map(item => {
                    if (item._id == result._id) {
                        return result;
                    } else {
                        return item;
                    }
                })
                setDataImages(newData);
            }).catch(err => {
                console.log(err);
            })
    }

    const unLikePost = (id) => {
        fetch("/unlike", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                const newData = dataImages.map(item => {
                    if (item._id == result._id) {
                        return result;
                    } else {
                        return item;
                    }
                })
                setDataImages(newData);
            }).catch(err => {
                console.log(err);
            })
    }

    const makeComment = (text, postId) => {
        fetch("/comment", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: postId,
                text: text,
            })
        }).then(res => res.json())
            .then(result => {
                console.log(result);
                const newData = dataImages.map(item => {
                    if (item._id == result._id) {
                        return result;
                    } else {
                        return item;
                    }
                })
                setDataImages(newData);
            }).catch(err => {
                console.log(err);
            })
    }

    const deletePost = (postid) => {
        fetch(`/deletepost/${postid}`, {
            method:"delete",
            headers:{
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result =>{
            console.log(result);
            const newData = dataImages.filter(item => {
                return item._id !== result.result._id
            })
            setDataImages(newData);
        }).then(M.toast({html:"Photo Deleted!",classes:"#64dd17 light-green accent-4"}))
        .catch(err => {
            console.log(err);
        })
    }

    return (
        <div className="home">   
            {dataImages.map((item, index) => {
                return (
                    <div key={item._id} className="card home-card">
                        <h5><Link to={item.postedBy._id !== state._id ? "/profile/" + item.postedBy._id: "/profile"}>{item.postedBy.name}</Link>{item.postedBy._id == state._id && <i style={{ float: "right" }} className="material-icons" onClick={()=>deletePost(item._id)}>delete</i>}</h5>
                        <div className="card-image">
                            <img src={item.photo} />
                        </div>
                        <div className="card-content">
                            <i className="material-icons">favorite_border</i>
                            {item.likes.includes(state._id) ?
                                <i className="material-icons"
                                    onClick={() => { unLikePost(item._id) }}
                                >thumb_down</i> :
                                <i className="material-icons"
                                    onClick={() => { likePost(item._id) }}
                                >thumb_up</i>
                            }
                            <h6>{item.likes.length} Likes</h6>
                            <h6>{item.title}</h6>
                            <p>{item.body}</p>
                            {item.comments.map((comment, index) => {
                                return (
                                    <h6 key={index +1}><strong>{comment.postedBy.name}</strong>{comment.text}</h6>
                                )
                            })}
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    makeComment(e.target[0].value, item._id)
                                }}>
                                <input type="text" placeholder="add a comment" />
                            </form>

                        </div>
                    </div>
                )
            })}

        </div>
    )
}

export default SubscribedUserPosts
