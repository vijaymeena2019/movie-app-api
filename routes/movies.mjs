import express from 'express';
import {Movie, validateMovie} from '../models/movie.mjs';
import {Genre} from '../models/genre.mjs';
import mongoose from 'mongoose';
import {auth} from  '../middleware/auth.mjs';
import { admin } from '../middleware/admin.mjs';

const router = express.Router();

router.get("/", async(req,res)=>{
    const movies = await Movie.find().sort("title");
    return res.send(movies);
})

router.get("/:id", async (req,res)=>{
    const movie = await Movie.findById(req.params.id); // null only be return when object id is 12 digit otherwise get wired error or use //mongoose.Types.ObjectId(req.params.id)
    if (!movie) return res.status(404).send(`The ID: ${req.params.id} is not exits`)

    return res.send(movie);
})


router.post('/', auth, async (req,res) => {
    

    // validation by Joi
    const {error} = validateMovie(req.body);
    if (error) return res.status(400).send(...error.details.map(e=> e.message))

    const { genreId ,numberInStock ,title ,dailyRentalRate }  = req.body;
    
    // Check if Movie title already exists
    const movieArray = await Movie.find({ title: title.trim()})
    if (movieArray.length) return res.status(400).send(`The name ${title} is already exists`)

    // Check if Genre Id is exists
    const genre = await Genre.findById(genreId);
    if (!genre) return res.status(400).send(`the Genre id ${req.body.genreId} is  not exists`)

    const movie = new Movie({  // creating object here by mongodb driver
        title: title,
        genre: genre,
        numberInStock: numberInStock,
        dailyRentalRate: dailyRentalRate 
    })

    //movie = await movie.save(); // we are reseting movie object which is  already created by mongodb drvie while creating object, so we can remove reassign here
    await movie.save();
    return res.send(movie);   
})


router.put('/:id', [auth], async (req,res)=>{
    // Validation
    const {error} = validateMovie(req.body)

    if(error) {
          let errors = ""
          error.details.map(errorInfo => errors += errorInfo.message + " ");
          return res.status(404).send(errors);
    }

    // Existance of Movie by Id
    const movie = await Movie.findById(req.params.id)
    if(!movie) return res.status(404).send(`ID ${req.params.id} is not exists`)

    // Existance of Genre by Id
    const genre = await Genre.findById(req.body.genreId)
    if(!genre) return res.status(404).send(`the genreId ${req.body.genreId} is not  exists`)

    // Update object
    movie.title = req.body.title;
    movie.numberInStock = req.body.numberInStock;
    movie.dailyRentalRate = req.body.dailyRentalRate;
    movie.genre = genre;

    // Saving to database
    const result = await movie.save();

    return res.send(result);
})

router.delete('/:id', [auth, admin], async (req,res) => {

    let movie = await Movie.findById(req.params.id)
    if(!movie) return res.status(404).send(`The ID ${req.params.id} is not exists`)

    movie = await Movie.findByIdAndRemove(req.params.id)

    return res.send(movie);
})

export default router;
