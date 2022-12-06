import express from 'express';
import {Customer, joiValidateCustomer} from '../models/customer.mjs';
import {auth} from '../middleware/auth.mjs';

const router = express.Router();


router.get("/", async (req,res)=>{
    const customers = await Customer.find().sort("name");
    return res.send(customers)

})



router.get("/:id", async (req,res)=>{
    const {id} = req.params;
    const customer = await Customer.findById(id);
    if(!customer) return res.status(404).send(`There is no customer with id ${id}`);

    res.send(customer);
})




router.post('/', auth, async (req,res)=>{
    const {error} =joiValidateCustomer(req.body);
    if(error) {
        let errors = ""
        error.details.message.map(errorInfo => errors +=  errorInfo + " ")
        return res.status(400).send(errors);
    }
    const {name, isGold, phone} = req.body;
    const customer = new Customer({
        isGold: isGold,
        name: name,
        phone: phone
    })

    await customer.save();
    return res.send(customer)
})



router.put("/:id", auth, async (req,res)=>{

   
    // Joi Validation
    const {error} =joiValidateCustomer(req.body);
    if(error) {
            let errors = ""
            error.details.map(detail => errors +=  detail.message + ", ")
            console.log(errors)
            return res.status(400).send(errors);
    }

    const customer = await Customer.findById(req.params.id)
    if (!customer) return req.status(404).send(`the id ${req.params.id} is not exists`)

        
    const {name, isGold, phone} = req.body
    customer.name = name;
    customer.isGold = isGold;
    customer.phone = phone;

    await customer.save()
    return res.send(customer)
})



router.delete("/:id", auth, async (req,res)=>{
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if(!customer) return res.status(404).send(`this id ${req.params.id} is not exists`)
    return res.send(customer);
})


export default router;
