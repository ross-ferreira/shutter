import React,{useState,useEffect} from 'react';
import {Link, useHistory } from 'react-router-dom';
import M from 'materialize-css';


const CreatePost = () => {

    const history = useHistory();
    const[title,setTitle] = useState("");
    const[body,setBody] = useState("");
    const[image,setImage] = useState("");
    const[url,setUrl] = useState("");

    useEffect(()=>{
        //if url exists
        if(url){
            fetch("/createpost",{
                method:"post",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer " + localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    title:title,
                    body:body,
                    picUrl:url,
                })
            }).then(res=>res.json())
                .then(data=>{
                    console.log(data);
                    if(data.error){
                        M.toast({html: data.error,classes:"#b71c1c red darken-4"});
                    } 
                    else {
                        M.toast({html:"Post Created Successfully",classes:"#64dd17 light-green accent-4"});
                        history.push("/");
                    }
                }).catch(error=>{
                    console.log(error)
                })
        }
    },[url])

    //For posting to CloudServer forImagery
    const postDetails= () => {
        const data = new FormData();
        data.append("file",image);
        data.append("upload_preset","photostory");
        data.append("cloud_name","papenwors01");
        fetch("https://api.cloudinary.com/v1_1/papenwors01/image/upload",{
            method:"post",
            body:data
        }) 
        .then(res=>res.json())
        .then(data=>{
            setUrl(data.url);
        })
        .catch(err=>{
            console.log(err)
        })
    }

    return(
        <div className="card input-filled">
            <input 
                type="text" 
                placeholder="title"
                value={title}
                onChange={(e)=>{setTitle(e.target.value)}}
            />
            <input 
                type="text" 
                placeholder="body"
                value={body}
                onChange={(e)=>{setBody(e.target.value)}}
 
            />
            <div class="file-field input-field">
                <div class="waves-effect waves-light btn red lighten-1">
                    <span>Upload Image</span>
                    <input type="file"
                        // value={body}
                        onChange={(e)=>{setImage(e.target.files[0])}}
                    />
                </div>
                <div class="file-path-wrapper">
                    <input class="file-path validate" type="text"/>
                </div>
            </div>
            <button onClick={()=>postDetails()}className="waves-effect waves-light btn red lighten-1">Submit Post</button>
        </div>
    )
}

export default CreatePost