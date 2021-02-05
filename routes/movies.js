const express = require('express');
const { required } = require('joi');
const mongoose = require('mongoose');
const {movieMongooseSchema:mongooseSchema, movieJoiSchema:joiSchema} = require('../models/movie')
const {genreMongooseSchema, genreJoiSchema} = require('../models/genre');
const router = express.Router();

const Movie = mongoose.model('movie',mongooseSchema);
const Genre = mongoose.model('genre',genreMongooseSchema);


router.get('/',async (req, res)=>{
    const movies = await Movie.find();
    res.send(movies);
});

router.get('/:id', async (req, res)=>{
    const movie = await Movie.findById(req.params.id);
    if(!movie){
        res.status(404).send("Movie could not be found");
        return;
    }
    res.send(movie);
});

router.post('/',async (req,res)=>{
    const {error, value} = joiSchema.validate(req.body);
    if(error){
        res.status(400).send("Invalid movie Object");
        return;
    }

    const genre = await Genre.findById(value.genreId);
    if(!genre){
        res.status(404).send("Invalid genre");
        return;
    }

    const movie = new Movie({
        title:value.title,
        genre: genre,
        numberInStock:value.numberInStock,
        dailyRentalRate:value.dailyRentalRate
    });

    const result = await movie.save();
    res.status(201).send(result);

})

router.put('/:id', async (req, res)=>{
    const movie = await Movie.findById(req.params.id);

    if(!movie){
        res.status(404).send("Movie could not be found");
        return;
    }

    const {error, value} = joiSchema.validate(req.body);
    if(error){
        res.status(400).send("Invalid movie Object");
        return;
    }

    const genre = await Genre.findById(value.genreId);
    if(!genre){
        res.status(404).send("Invalid genre");
        return;
    }

    const result = await Movie.updateOne({_id:req.params.id},{
        $set:{
            title:value.title,
            genre:genre,
            numberInStock:value.numberInStock,
            dailyRentalRate:value.dailyRentalRate
        }
    })
    res.status(200).send(result);
});

router.delete('/:id', async (req, res)=>{
    const movie = await Movie.findById(req.params.id);

    if(!movie){
        res.status(404).send("Movie could not be found");
        return;
    }

    await Movie.findByIdAndDelete(movie._id);
    res.status(200).send(movie);
});

module.exports = router;