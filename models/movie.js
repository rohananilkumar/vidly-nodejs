const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const {genreMongooseSchema, genreJoiSchema} = require('./genre')

const movieMongooseSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    genre: {
        type:genreMongooseSchema,
        required:true
    },   
    numberInStock:{
        type:Number,
        required:true
    },
    dailyRentalRate:{
        type:Number
    }
})

const movieJoiSchema = Joi.object({
    title:Joi.string().required(),
    genreId:Joi.objectId().required(), //Joi schema can be a constraint
    numberInStock:Joi.number().required(),
    dailyRentalRate:Joi.number()
})


exports.movieJoiSchema = movieJoiSchema;
exports.movieMongooseSchema = movieMongooseSchema;