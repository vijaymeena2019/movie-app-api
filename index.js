import express from 'express';
import mongoose from 'mongoose';
import genres from './routes/genres.mjs';
import home  from './routes/home.mjs';
import customers from './routes/customers.mjs';
import movies from './routes/movies.mjs';
import rentals from './routes/rentals.mjs';
import registration from './routes/registration.mjs';
import Joi from 'joi'; // also adding this
import auth from './routes/auth.mjs';
import config from 'config';
import cors from  'cors';
import joiFunction from  'joi-objectid';//move to index.js to use everwhere // give fn
Joi.objectId = joiFunction(Joi); // it also give fn
import debugfn from  'debug';
const  appDebugger = debugfn('vijay');
const dbDebugger = debugfn('database');

console.log('config',config.get('name'));
appDebugger('app debugger here....')
dbDebugger('db debugger is  here')
if (!config.get('jwtPrivateKey')){
    console.error("FATAL ERROR: jwtPrivateKey is not defined")
    process.exit(1); // 0 means success , other mean failiure
} 

// Connect to DB
mongoose.connect('mongodb://localhost:27017/genres-exercises')
    .then(()=>console.log("Connected to mongodb"))
    .catch(err => console.error("Getting Error While Connecting to Database...", err))

const app = express();

app.use(cors());

app.use(express.json());



app.use('/', home);

app.use('/api/genres', genres);

app.use("/api/customers", customers);

app.use("/api/movies", movies);

app.use("/api/rentals", rentals);

app.use("/api/registration", registration);

app.use("/api/auth", auth);


const port = process.env.PORT || 3000
app.listen(port,()=> console.log(`I am running at ${port}`));