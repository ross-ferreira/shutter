//1st we need to acquire express
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require ("../middleware/requireLogin")
const Post = mongoose.model("Post")

// (req,res) Call Back Function
router.post('/createpost',requireLogin,(req,res)=>{
    const {title,body,picUrl} = req.body
    if(!title || !body || !picUrl){
        res.status(422).json({error:"Please add all the fields"})
    }
    req.user.password = undefined
    const post = new Post({
        title:title,
        body:body,
        photo:picUrl,
        postedBy:req.user
    })

    post.save().then(result=>{
        res.json({post:result})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get('/allpost',requireLogin,(req,res)=>{
    //use Find with no aguments as we want ALL 
    Post.find()
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    //add "-" to created at for Asc order
    .sort('-createdAt')
    .then(posts=>{
        res.json({posts:posts})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get('/mypost',requireLogin,(req,res)=>{
    //use Find with no Posted by ID
    Post.find({postedBy:req.user._id})
    .populate("postedBy","_id name")
    .then(mypost=>{
        res.json({mypost:mypost})
    })
    .catch(err=>{
        console.log(err)
    })
})



router.put('/like', requireLogin,(req,res)=>{
    //Need to pass postId in Header for Filter
    Post.findByIdAndUpdate(req.body.postId,{
        //need to PUSH as its adding to the Likes ARRAY
        $push:{likes:req.user._id }
    },{
        //new updated record for Mongo
        new:true
    }).populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err}) 
        } else {
            res.json(result)
        }
    }) 
})


router.put('/unlike', requireLogin,(req,res)=>{
    //Need to pass postId in Header for Filter
    Post.findByIdAndUpdate(req.body.postId,{
        //need to PUSH as its adding to the Likes ARRAY
        $pull:{likes:req.user._id }
    },{
        new:true
    }).populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        } else {
            res.json(result)
        }
    }) 
})

router.put('/comment', requireLogin,(req,res)=>{
    const newComment ={
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{

        $push:{comments: newComment }
    },{
        new:true
    })
    .populate("postedBy","_id name")
    //we dont just want user id-- we want name
    .populate("comments.postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err}) 
        } else {
            res.json(result)
        }
    }) 
})

router.delete('/deletepost/:postId', requireLogin, (req,res)=>{
    // params in the URL
    Post.findOne({_id:req.params.postId})
    .populate("comments.postedBy","_id name")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
            post.remove()
            .then(result => {
                res.json({result})
            }).catch(err=>{
                consol.log(err);
            })
        }

    }) 
})

router.get('/subscribeposts',requireLogin,(req,res)=>{
    //check to see whether this posts exists in the array, if so return post($in logic....python)
    //https://docs.mongodb.com/manual/reference/operator/query/in/
    Post.find({postedBy:{$in:req.user.following}})
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .then(posts=>{
        res.json({posts:posts}) 
    })
    .catch(err=>{
        console.log(err)
    })
})

module.exports = router