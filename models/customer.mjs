import mongoose from 'mongoose';
import Joi from 'joi';



const customerSchema = new mongoose.Schema({
    isGold: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        minlength: 2,
        maxlength: 50
    },
    phone: {
        type: String,
        minlength: 8,
        maxlength: 10
    },
})

export const Customer = mongoose.model("customer", customerSchema);

const joiSchema = Joi.object({
    name: Joi.string().max(50).min(3).required(),
    isGold: Joi.boolean().required(),
    phone: Joi.string().min(8).max(10).required()
    })
export const joiValidateCustomer = function (customer) {
    return joiSchema.validate(customer);
}