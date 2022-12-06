import mongoose from 'mongoose';
import Joi from 'joi';



// Define Genre schema
export const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    }
})

// Create Model Class
export const Genre = mongoose.model('Genre', genreSchema)

const joiSchema = Joi.object({
    name : Joi.string().min(5).max(255).required()
})
export function validateGenre(genre) {
        return joiSchema.validate(genre)
}
