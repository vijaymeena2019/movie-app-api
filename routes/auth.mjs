import {User} from "../models/user.mjs";
import express from 'express';
import _ from 'lodash';
import passwordComplexity from "joi-password-complexity";
import bcrypt from 'bcrypt';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import config from 'config';


const router = express.Router();



router.post("/", async ( req, res ) => {
    // joi validation
    let {error} = joiSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message)

    //User not Exist
    let user = await User.findOne({ email: req.body.email.trim()})
    if (!user) return res.status(400).send("Invalid Email or Password");

    // // password text validation
    // const label = "Password";
    // ({error} = passwordComplexity(undefined, label).validate(req.body.password))
    // if (error) return res.status(400).send(error.details[0].message);

    // Authantication Check
    const validatePassword = await bcrypt.compare(req.body.password, user.password)
    if(!validatePassword) return res.status(400).send(`Invalid Email or Password`)

    // JSON web token payload
    const token = user.generateAuthToken();
    // const token = jwt.sign({ _id: user._id}, config.get('jwtPrivateKey'));   //  1 arg - payload obj(it is upto us that what properties we want to include), 2nd arg is name of our appliation settings which have seceret or private key which will be in enviroment variable
    // set vidly_jwtPrivateKey=our_password
    // we're going to take this private key out and store it in an environment variable.Because as I told you before, 
    // you should never store secretsin our code base. Otherwise these secrets are visible to anyone who has access to your course code. 
    
    // index.js
    // When the application starts, we want to make sure that this environment
    // variable is set. Otherwise we need to terminate the application because our
    // authentication endpoint cannot function properly.
    
    // Result
    res.send(token); // out is _id and iat , this iat used to determine our jwt age
})

const joiSchema = Joi.object({
    email: Joi.string().email().min(8).max(255).required(),
    password : Joi.string().min(8).max(1024).required()
})

export default router;

