const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;

const userSchema = new  mongoose.Schema({
    name : {
        type:String,
        required:true,
    }, 
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    resetToken:{
        type:String,
    },
    expireToken:{
        type:Date,
    },
    followers:[{
        type:ObjectId,
        ref:"User",
    }],
    following:[{
        type:ObjectId,
        ref:"User",
    }],
    profilePic:{
         type:String,
         default:"https://res.cloudinary.com/papenwors01/image/upload/v1590346770/profile_images_photostory/default_profile_img.png",
    }
})

mongoose.model("User",userSchema)

// give name to model^ "User"