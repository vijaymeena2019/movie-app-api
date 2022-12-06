import express from 'express';
import {Genre, validateGenre} from '../models/genre.mjs';
import {auth} from '../middleware/auth.mjs';
import {admin} from '../middleware/admin.mjs';

const router = express.Router();

router.get("/", async (req,res)=>{
    const genres = await Genre.find();
    console.log(genres)
    return res.send(genres);
})



router.get("/:id", async (req,res)=>{
    const genre = await Genre.findById(req.params.id)
    console.log(genre);
    if (!genre) return res.status(404).send(`The ID: ${req.params.id} is not exits`)

    return res.send(genre);
})

router.post('/', auth, async (req,res) => { // auth middleware function execute first before route handller(req,res)

    const {error} = validateGenre(req.body);

    if (error) return res.status(400).send(...error.details.map(e=> e.message))

    // Check is Genre name already exists
    const genreArray = await Genre.find({ name: req.body.name})
    if (genreArray.length) res.status(400).send(`The name ${req.body.name} is already exists`)

    // Creating genre
    const genre = new Genre({
        name: req.body.name
    })

    await genre.save();
    return res.send(genre);
    // isExists(req.body.name).then(aray => {
    //     if (aray.length) {
    //        return res.status(404).send(`Error: the name ${req.body.name} is already exist in genres`)
    //     }
    //     // Create Genre
    //     createGenre(req.body.name).then(genre => {
    //         console.log("Genre in Post: ", genre);
    //         return res.send(genre);
    //     })
    //     .catch(error => console.error("Error: Object could not save in database",error))
    // })
    // .catch(error => console.error(`Error While searching existance`))
    
})


router.put('/:id', auth, async (req,res)=>{
    // Validation
    const {error} = validateGenre(req.body)

    if(error) {
          let errors = ""
          error.details.message.map(errorInfo => errors += errorInfo + " ");
          return res.status(404).send(errors);
    }

    // Existance by Name
    let genreArray = await Genre.find({name:req.body.name});
    if (genreArray.length) return res.status(400).send(`The name ${req.body.name} is already exists`)

    // Existance by Id
    const genre = await Genre.findById(req.params.id)

    if(!genre) return res.status(404).send(`ID ${req.params.id} is not exists`)
    
    // Update object
    genre.name = req.body.name;

    // Saving to database
    await genre.save();

    return res.send(genre);
})


router.delete('/:id', [auth, admin], async (req,res) => {
    // const genre = isExists(req.params.id);
    let genre = await Genre.findById(req.params.id)
    if(!genre) return res.status(404).send(`The ID ${req.params.id} is not exists`)

    // const index = genres.indexOf(genre);
    // genres.splice(index,1);

    genre = await Genre.findByIdAndRemove(req.params.id)

    return res.send(genre);
})

export default router;
