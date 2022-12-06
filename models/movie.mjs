import mongoose from 'mongoose';
import Joi from 'joi';
import {genreSchema} from './genre.mjs';
import joiextend from 'joi-objectid';  // it will give a funciton and we will pass a  reference of "Joi" here
Joi.objectId = joiextend(Joi);

// Define Genre schema
const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock : {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max:10
    }
})

// Create Model Class
export const Movie = mongoose.model('Movie', movieSchema)

const joiSchema = Joi.object({
    title : Joi.string().min(5).max(255).required(),
    genreId : Joi.objectId().required(),     // doubt - here Joi.objectId gives error but in rental.mjs Joi.objectId is not giving  error why?
    numberInStock: Joi.number().min(0).max(100).required(),
    dailyRentalRate: Joi.number().min(0).max(10).required()
})
export function validateMovie(movie) {
        return joiSchema.validate(movie)
}