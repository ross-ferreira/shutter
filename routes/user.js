//1st we need to acquire express
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require ("../middleware/requireLogin")
const Post = mongoose.model("Post")
const User = mongoose.model("User")

router.get('/user/:id', requireLogin, (req,res)=>{
    User.findOne({_id:req.params.id})
    .select("-password")
    .then(user=>{
        Post.find({postedBy:req.params.id})
        .populate("postedby","_id name")
        .exec((err,posts)=>{
            if(err){
                return res.status(422).json({error:err})
            }
            res.json({user,posts})
        })
    }).catch(err=>{
        return res.status(404).json({error:"User not found!"})
    })

})


//2nd argument in find and update is to update, 3rd is to tell mongo new entry.. new:true
router.put('/follow',requireLogin,(req,res)=>{
    //followeeId person you want to follow
    User.findByIdAndUpdate(req.body.followeeId,{
        //this is _id of logged in user
        $push:{followers:req.user._id}
    },{
        new:true
        //callback below....
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        //then update follower "followings" array
        User.findByIdAndUpdate(req.user._id,{
            $push:{following:req.body.followeeId}
        },{
            new:true 
        })//want to remove password from request
        .select("-password")
        .then(result=>{
            res.json(result)
        }).catch(err=>{
            return res.status(422).json({error:err})
        })
    })
    
})


//2nd argument in find and update is to update, 3rd is to tell mongo new entry.. new:true
router.put('/unfollow',requireLogin,(req,res)=>{
    //followeeId person you want to follow
    User.findByIdAndUpdate(req.body.unfolloweeId,{
        //this is _id of logged in user
        $pull:{followers:req.user._id}
    },{
        new:true
        //callback below....
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        //then update follower "followings" array
        User.findByIdAndUpdate(req.user._id,{
            $pull :{following:req.body.unfolloweeId}
        },{
            new:true
        })
        .select("-password")
        .then(result=>{
            res.json(result)
        }).catch(err=>{
            return res.status(422).json({error:err})
        })
    })
   
})

router.put('/updateProfilePic',requireLogin, (req,res)=>{
    //check mongoose docs for $set
    User.findByIdAndUpdate(req.user._id,{$set:{profilePic:req.body.profilePic}},{new:true},
        (err,result)=>{
            if(err){
                return res.status(422).json({error:"Picture not uploaded"})
            }
            res.json(result)
    })
})

router.post('/search-users',(req,res)=>{
    // checkout RegEx on MDN "^" will search for all records starting with:
    let userPattern = new RegExp("^" + req.body.query);
    User.find({email:{$regex:userPattern}})
    //only want id and email
    .select("_id email")
    .then(userRecord=>{
        res.json({userRecord:userRecord})
    }).catch(err=>{
        console.log(err)
    })
})


module.exports = router