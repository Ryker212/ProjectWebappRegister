require('dotenv').config();
require('./config/database').conect();

const User =require('./modle/user');
const express = require("express");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require("./middleware/auth");

const app = express()

app.use(express.json())

// login here
app.post("/login",async (req, res) => {
    //login logic
    try{
        const {email, password} = req.body;

        //validate user input
        if(!(email&& password)){
            res.status(400).send("All input is requried");
        }

        //validate if user exit in database
        const user = await User.findOne({email});

        if(user && (await bcrypt.compare(password, user.password)) ){
            //create token
            const token = jwt.sign(
                {user_id: user._id,email},
                process.env.TOKEN_KEY,{
                    expiresIn:"2h"
                }
            )
            //save token
        user.token = token;

        res.status(200).json(user);

        }
        else{
        res.status(400).send("Invalid Credentials");}
        

    }catch(err){
        console.log(err);
    }
})


// Register here
app.post("/register",async (req, res) => {
    //register logic

    try{
        // get user input
        const { first_name, last_name, email, password } = req.body;

        //validate user input
        if(!(email && password && first_name & last_name)) {
            res.status(400).send("All input is requried");
        }

        // check if user already exit
        // validate if user exit in our database
        const oldUser = await User.findOne({ email });

        if(oldUser){
            return res.status(409).send("User already exist. Please login");
        }

        //encryption password
        encrytedPassword = await bcrypt.hash(password, 10);

        //create user in database
        const user = await User.create({
            first_name,
            last_name,
            email: email.toLowerCase(),
            password: encrytedPassword
        })

        //create token
        const token = jwt.sign(
            {user_id: user._id, email},
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h"
            }
        )

        //save user token
        user.token = token;

        //return new user
        res.status(201).json(user);


    }catch(err){
        console.log(err);
    }
})

app.post("/welcome", auth,(req, res)=>{
    res.status(200).send("welcome eiei");
})

module.exports =app;