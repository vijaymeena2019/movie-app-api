import express from 'express';
import {Rental, validateRental} from '../models/rental.mjs';
import {Customer} from '../models/customer.mjs';
import {Movie} from '../models/movie.mjs';
// import Fawn from 'fawn'; 
import mongoose from 'mongoose';
import {auth} from '../middleware/auth.mjs'

const router = express.Router();

// Not worked  in  updated  version
//Fawn.init("mongodb://127.0.0.1:27017/genres-exercises");
// Fawn.init(mongoose) // it will not work in new update


router.get("/", async (req,res)=>{
    const rentalArray = await Rental.find()
    return res.send(rentalArray);
}),

router.get("/:id", async (req, res) => {
   // If rental obj is exist
   const rental = await Rental.findById(req.params.id);
   if (!rental) return res.status(404).send(`The Rental ID is not exist`)

   res.send(rental)
   
})

router.post("/", auth, async (req,res) => {
    // joi validation
    const { error } = validateRental(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    // customerId  validation
    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(404).send(`Customer  is not exist`)

    // Movie id validation
    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(404).send(`movie id is not exist`);

    // Stock validation
    if (movie.numberInStock === 0) return res.status(400).send("Movie not in Stock")
    const {_id:customerId, name, phone, isGold} = customer;
    const { _id:movieId, title, dailyRentalRate} = movie;
    const { dateOut, dateReturn, rentalFee } = req.body;
    const rental = new Rental({
        customer: {
            _id: customerId,
            name: name,
            phone: phone,
            isGold: isGold,
        },
        movie: {
            _id: movieId,
            title: title,
            dailyRentalRate:  dailyRentalRate
        }
    })
    // To make sure either  Both of  them saved or not, To ensure that we use 'Transaction' or  2 phase Commit(mongodb)
    // const rentalSaved = await rental.save();
    // movie.numberInStock--;
    // const movieSaved = await movie.save();

// Now, we are no longer going to create this rental and update the movie explicitly. Instead we are going to
// create a task object, which is like a transaction.

//Now here we can add one or more operations. And all these operations together, will be treated as a unit. 

// Note that here

// we are working directly with the collection. That's why we need to pass actual name of the collection, which is plural, not singular,
// and also note that this name is case sensitive. So in MongoDB compass, you can see the name of our collections, they're all lowercase.
    // try{
    //     new Fawn.Task()
    //         .save('rentals', rental) //#1 operation // 1 arg is name of  the collection in mongodb, 2 arg is our new rental object
    //         .update("movies", { _id: movie._id }, { $inc: { numberInStock: -1 }} ) // collection name, query obj, our update obj
    //         // .remove() // any other operation
    //         .run() // finally we need to call run

    //     return res.send(rental)
    // }
    // catch(ex) {
    //     return res.status(500).send('operation failed')
    // }}

    try {
        const session = await mongoose.startSession();
        await session.withTransaction(async () => {
          const result = await rental.save();
          movie.numberInStock--;
          movie.save();
          res.send(result);
        });
  
        session.endSession();
        console.log('success');
      } catch (error) {
        console.log('error111', error.message);
      }
    }
)

// we will use libery for 2 phase commit -> npm i fawn


// router.put("/:id", async (req, res) => {
//     const { error } = validateRental(req.body);
//     if (error) {
//      return res.status(400).send(error.details[0].message);
//     }

//     // Rental obj is exist
//     const rental = await Rental.findById(req.params.id);
//     if (!rental) return res.status(404).send(`Rental Obj is  not  exist`)
    
//     // get customer obj
//     const customer = await Customer.findById(req.body.customerId);
//     if (!customer) return res.status(404).send(`Customer  is not exist`)

//     // Movie id validation
//     const movie = await Movie.findById(req.body.movieId);
//     if (!movie) return res.status(404).send(`movie id is not exist`);

//     const {_id:customerId, name, phone, isGold} = customer;
//     const { _id:movieId, title, dailyRentalRate} = movie;

//     const {rentalStart, rentalEnd, totalCost} = req.body
//     // Udateing
//         rental.customer._id = customerId
//         rental.customer.name = name
//         rental.customer.phone = phone
//         rental.customer.isGold = isGold
//         rental.movie._Id = movieId
//         rental.movie.title = title
//         rental.movie.dailyRentalRate = dailyRentalRate
    
//     await rental.save();
//     return res.send(rental);

// })

router.delete("/:id", auth, async (req,res) => {
    const rental = await Rental.findByIdAndRemove(req.params.id);
    if (!rental) return res.status(404).send(`Rental Not Fount`);

    return res.send(rental);

})
export default router;

