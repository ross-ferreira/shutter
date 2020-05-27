//1st we need to acquire express
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')
const requireLogin = require('../middleware/requireLogin')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const {SENDGRID_API} = require('../config/keys')

const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:SENDGRID_API
    }
}))

//from here we can create API Routes

router.post('/signup', (req,res)=>{
    const {name,email,password,profilePic} = req.body
    if (!email || !password || !name){
        return res.status(422).json({error: "please add all the fields"})
    }

    // res.json({message:"Successfully Posted"})

    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({error: "User Already Exists with that email "})
        }
        // use bcrypt before creating the User

        bcrypt.hash(password,12)
        .then(hashedpassword=>{
            //if the user doesnt exist then lets make a NEW User
            const user = new User({
                email:email,
                name:name,
                password:hashedpassword,
                profilePic:profilePic
            })
    
            user.save()
            .then(result => {
                transporter.sendMail({
                    to:user.email,
                    from:"ross.p.ferreira@gmail.com",
                    subject:"Signup Success",
                    html:"<h1>Welcome to Shutter</h1>"
                })
                res.json({message:"Successfully Created"})
            })

            .catch(err=>{
                console.log(err)
            })
        })
    })
    .catch(err =>{
        console.log(err)
    })
})

//Only for Test Purposes
// router.get('/protected',requireLogin,(req,res)=> {
//     res.send("Hello,User")
// })


router.post('/signin', (req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
        return res.status(422).json({error: "Please Add email or password "})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
            return res.status(422).json({error: "Invalid email or password"})
        }
        //to compare paSSwords you can use BCRYPT
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                // res.json({message:"Successfully signed in"})
                //add jsonwebtoken token package for giving tokens to user
                const token = jwt.sign({_id: savedUser._id},JWT_SECRET)
                // deconstruct user for sending user data
                const {_id,name,email,followers,following,profilePic} = savedUser
                res.json({
                    token : token,
                    user:{_id,name,email,followers,following,profilePic}
                })
            }
            else{
                return res.status(422).json({error: "Invalid email or password"})
            }
        })
        .catch(err =>{
            console.log(err)
        })
    })

    })

    //router.METHOD(URL,CALLBACK)
    router.post('/resetpassword', (req,res)=>{
        //(SIZE,CALLBACK)
        crypto.randomBytes(32,(err,buffer )=>{
            if(err){
                console.log(err)
            }
            const token = buffer.toString("hex")
            User.findOne({email:req.body.email })
            .then(user=>{
                if(!user){
                    return res.status(422).json({error: "User doesn't exist with that email"})
                }
                user.resetToken = token;
                //user can only reset password within 1hr
                user.expireToken = Date.now() + 3600000;
                user.save().then((result)=>{
                    transporter.sendMail({
                        to:user.email,
                        from:"ross.p.ferreira@gmail.com",
                        subject:"Password Reset",
                        html:`
                        <p>You requested for password reset</p>
                        <h5>Click on this <a href="${EMAIL}/resetpassword/${token}">Link</a> to reset password</h5>
                        `
                    })
                    res.json({message:"check your email"})
                })
            })
        })
    })


    router.post('/newpassword',(req,res)=>{
        const newPassword = req.body.password;
        const sentToken = req.body.token;
        User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
        .then(user=>{
            if(!user){
                return res.status(422).json({error:"Try again session expired"})
            }
            bcrypt.hash(newPassword,12).then(hashedpassword=>{
                user.password = hashedpassword;
                user.resetToken = undefined;
                user.expireToken = undefined;
                user.save().then((saveduser)=>{
                    res.json({message:"Password Successfully Updated"})
                })
            })
        }).catch(err=>{
            console.log(err)
        })
    })




module.exports = router 


//using BCRYPT.js for saving passwords on database for hidden