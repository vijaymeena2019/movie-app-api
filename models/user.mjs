import mongoose from 'mongoose';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import config from 'config';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        maxlength: 255,
        required: true
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        minlength: 5,
        maxlength: 255,
        required: true
    },
    password:{
        type: String,
        minlength:8,
        maxlength: 1024,
        required: true
    },
    isAdmin: Boolean
    // , roles: []  // for more complex application
    // , operations: []
})

userSchema.methods.generateAuthToken = function () { // use regular funciton , not the arrow bcoz arrow do not have their own 'this'
    return jwt.sign({ _id: this._id,
         isAdmin: this.isAdmin,
         email: this.email,
         name: this.name
        }, config.get('jwtPrivateKey'));  // 1st is payload
} // return an object we can add additional key value pair in this object

export const User = mongoose.model("User", userSchema)


const joiSchema = Joi.object({
        name: Joi.string().min(5).max(255).required(),
        email: Joi.string().email().min(5).max(255).required(),
        password: Joi.string().min(5).max(255).required()
    })

export const userValidate = (user) => {
    return  joiSchema.validate( user );
}



