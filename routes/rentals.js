const express = require('express');
const mongoose = require('mongoose');
const {rentalMongooseSchema, rentalJoiSchema} = require('../models/rental');
const {customerMongooseSchema} = require('../models/customer');
const {movieMongooseSchema} = require('../models/movie');
const Fawn = require('fawn');

Fawn.init(mongoose);

const router = express.Router();

const Rental = mongoose.model('rental',rentalMongooseSchema);
const Customer = mongoose.model('customer',customerMongooseSchema);
const Movie = mongoose.model('movie',movieMongooseSchema);

router.get('/', async (req, res)=>{
    const rentals = await Rental.find();
    res.send(rentals);
})

router.get('/:id', async (req, res)=>{
    const rental = await Rental.findById(req.params.id);

    if(!rental){
        res.status(400).send("Rental not found");
        return;
    }

    res.send(rental);
})

router.post('/',async (req,res)=>{
    const {error, value} = rentalJoiSchema.validate(req.body);
    if(error){
        res.status(400).send(error);
        return;
    }

    const movie = await Movie.findById(value.movieId);
    if(!movie){
        res.status(404).send("Movie object not found");
        return;
    }

    if(movie.numberInStock == 0){
        return res.status(400).send('Movie not available for renting');
    }

    const customer = await Customer.findById(value.customerId);
    if(!customer){
        res.status(404).send("Customer object not found");
        return;
    }

    const rental = new Rental({
        customer:{
            _id:customer._id,
            name:customer.name,
            isGold:customer.isGold
        },
        movie:{
            _id:movie._id,
            title:movie.title,
            dailyRentalRate:movie.dailyRentalRate
        }
    })
    try{
        new Fawn.Task()
        .save('rentals',rental)
        .update('movies', {_id:movie._id},{
            $inc:{numberInStock: -1}
        }).run();
        res.status(201).send(rental);
    }
    catch{
        res.status(500).send("Something Failed");
    }
    

    
})

module.exports = router;