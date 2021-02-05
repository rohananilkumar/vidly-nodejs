const express = require('express');
require('express-async-errors');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const mongoose = require('mongoose');
const asyncMiddleware = require('../middleware/async'); 
const {genreMongooseSchema:mongooseSchema, genreJoiSchema:joiSchema} = require('../models/genre');

const router = express.Router();

Genre = mongoose.model("Genre", mongooseSchema);


router.get('/', async (req,res,next)=>{
    const genres =await Genre.find();
    res.send(genres);
});

router.get('/:id',async (req,res)=>{
    console.log(`get ${req.params.id}`)
    const genre = await Genre.find({_id:req.params.id})
    res.send(genre);
})

router.post('/', auth, async (req,res)=>{       //The second argument is the custom middleware

    const {error, value} = joiSchema.validate(req.body);

    if(error){
        res.status(400).send("Invalid genre object");
    }
    else{
        const genre = new Genre({name:value.name})
        await genre.save();
        res.status(201).send(genre);
    }
})

router.put('/:id', auth, async (req,res)=>{
    const {error, value} = joiSchema.validate(req.body);

    if(error){
        res.status(400).send("Invalid genre object");
    }
    
    const genreInDb = await Genre.findById(req.params.id);
    genreInDb.name = value.name;
    var result = await genreInDb.save();

    res.status(201).send(result);
    
})

router.delete('/:id', [auth, admin], async (req,res)=>{ //The second argument is the middlewares that will be executed in sequence
    console.log("delete request");

    const genre = await Genre.find({_id:req.params.id});

    if(genre){
        await Genre.deleteOne({_id:req.params.id});
        res.status(200).send(genre);
    }
    else{
        res.send(404).send('Object was not found in the server');
    }
})

module.exports = router;