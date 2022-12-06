import {User, userValidate} from "../models/user.mjs";
import express from 'express';
import _ from 'lodash';
import passwordComplexity from "joi-password-complexity";
import bcrypt from 'bcrypt';
import config from 'config';
import jwt from 'jsonwebtoken';
import {auth} from '../middleware/auth.mjs'; // authorition


//Note : you should not store tokens in your database

const router = express.Router();

router.get("/me", async (req, res) => {
    console.log("vijay meena");
    const user = await User.findById(req.user._id).select('-password')
    res.send(user);
})

await User.findById()
req.user._id

router.post("/", async ( req, res ) => {
    console.log(req.body)
    // joi validation
    let {error} = userValidate(req.body);
    if (error) return res.status(400).send(error.details[0].message)

    // Unique
    const userExist = await User.findOne({ email: req.body.email})
    if (userExist) return res.status(400).send("User is alredy registered");

    // password validation
    const label = "Password";
    ({error} = passwordComplexity(undefined, label).validate(req.body.password))
    if (error) return res.status(400).send(error.details[0].message);

    // Using lodash
    const user = new User(_.pick(req.body, ['name', 'email', 'password']))
    console.log("user in users.mjs", user);
    // Password hash
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password , salt)
    // or
    // const { name, email, password } = req.body;
    // const user = new User({
    //     name: name,
    //     password: password,
    //     email: email
    // })

    await user.save();

// A better approach is to return the json web token into an http header.So just like we have headers in our request,
// we also have headers in our reponse object. 
    const token = user.generateAuthToken(); // first you need to make changes in user model
//    const token = jwt.sign({ _id: user._id}, config.get('jwtPrivateKey')); // moved to user model
    // Object Orianted Programming Principal Called - Information Expert Principal
    // It means an object that has enough information and is an expert in a given area, that
    // object should be responsible for making decisions and performing tasks.
    // it's the user object that should be responsible for generating this authentication token.
    // so that function that I wrote here, generate authentication token, that function should not be hanging
    // somewhere in the user model, that should be a method in the user object.

    // wesend the response to the client to generate the token and
    // then we call response.header, with this we can set
    // header, now for any custom headers that we define in our application
    // we should prefix this headers with x-
    // Now we give it an arbitrary name like authentication
    // or auth-token, this is a
    // first argument which is the name of the header, the second argument is the value, which
    // in this case our token
    
    
    
    
    // Using lodash - we can return jwt token with array of properties but it is  not a  user property
    return res.header(`x-auth-token`, token) // setting custom headers
        .header("access-control-expose-headers", "x-auth-token") // standard http header to see the client (key, value ) ,this header lets a web browser whitelist the headers that the browser or the client is allowing to access. expose custome headers
        .send(_.pick(user, ["_id", 'email', 'name'])) // 1st arg is user object, 2nd is array of properties in  user object and it will return object with only those properties
    // header 1 arg is name of  our header and 2nd arg is our token
    
    
    
    
    // or 
    // return res.send({ // otherwise password is also sent
    //     user: user.email,
    //     name: user.name,
    //     _id: user._id
    // });
})

export default router;

