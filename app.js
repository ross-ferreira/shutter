const express = require('express')

const app = express()

const mongoose = require('mongoose')

// now we need to listen on a specific port
// const PORT = 5000
//listen to web port and local
const PORT = process.env.PORT || 5000 

// https://mongoosejs.com/docs/deprecations.html
// FOR DB Connection 
    const {MONGOURI} = require ('./config/keys')

    mongoose.connect(MONGOURI,{
        useUnifiedTopology: true,
        useNewUrlParser:true,
        useFindAndModify: false 
    })

    mongoose.connection.on('connected', ()=>{
        console.log ('connected to mongo yeah')
    })

    mongoose.connection.on('error', (err)=>{
        console.log ('err connecting',err)
    })

//FOR DB Connection
require('./models/user')
require('./models/post')

//this allows json data to be passed via our API requs- like a middleware
app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

//For production-only
// if(process.env.NODE_ENV === "production"){
//     app.use(express.static('client/build'))
//     const path = require('path')
//     //if any request is made, load index.html
//     app.get("*",(req,res)=>{
//         res.sendFile(path.resolve(__dirname,'client','build','index.html'))
//     })
// }
if(process.env.NODE_ENV === "production"){
    app.use(express.static('client_side/build'))
    const path = require('path')
    //if any request is made, load index.html
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client_side','build','index.html'))
    })
}




//Need call back function again 
app.listen(PORT,()=>{
    console.log("server is running",PORT)
})

// use "nodemon app" will automaticaly restart the server on changes
 

// ******EXPLANATIONS BELOW *******

//The Middleware will modify the request before its reaches the route handler
// const customMiddleware = (req,res,next) => {
//     console.log("middleware executed!!")
//     next()
// }


 
// // We add a callback funtion that takes 2 arguments
// app.get ('/',(requ,res)=>{
//     //use console log we can see route being exe after middleware
//     console.log("home")
//     res.send("hello world")
// })



// app.get ('/about',customMiddleware,(requ,res)=>{
//     console.log("about")
//     res.send("About Page")
// })


// const express = require("express");
// const path = require("path");
// const favicon = require("serve-favicon");
// const logger = require("morgan");
// require("dotenv").config();
// require("./config/database");

// const app = express();

// app.use(logger("dev"));
// app.use(express.json());
// app.use(favicon(path.join(dirname, "build", "favicon.ico")));
// app.use(express.static(path.join(dirname, "build")));
// app.use("/api/users", require("./routes/api/users"));

// app.get("/*", function (req, res) {
// res.sendFile(path.join(__dirname, "build", "index.html"));
// });

// const port = process.env.PORT || 3001;

// app.listen(port, function () {
// console.log(express app running on port ${port});
// });