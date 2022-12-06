import mongoose from  'mongoose';
import Joi from 'joi';
// import joiFunction from  'joi-objectid';//move to index.js to use everwhere // give fn
// Joi.objectId = joiFunction(Joi); // it also give fn


// Embedded

export const Rental = mongoose.model("Rental" , new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: {
                type: String,
                minlength: 3,
                maxlength: 100,
                trim: true,
                required: true
            },
            isGold: {
                type: Boolean,
                default: false
            },
            phone: {
                type: Number,
                min: 1,
                max: 9999999999,
                required: true
            }
        }),
        required: true
    },
    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                minlength: 5,
                trim: true,
                maxlength: 255,
                required: true
            },
            dailyRentalRate: {
                type: Number,
                min: 0,
                max: 10,
                required: true
            }   
        }),
        required:true 
    },
    dateOut: {
        type: Date,
        default: Date.now,
        required: true
    },
    dateReturn: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }
}))

const joiSchema = Joi.object({
    // To capture invalid object id 
    //mongoose.Types.ObjectId.isVaild(_id) // return boolean
    // or
    // Using libery -> joi-objectid
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required() 
        // Other things should be set on the server, not by the customer
    })
export function validateRental (rental) {
    return joiSchema.validate(rental);
}