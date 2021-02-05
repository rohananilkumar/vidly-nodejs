const mongoose = require('mongoose');
const Joi = require('Joi');

const genreJoiSchema = Joi.object({
    name: Joi.required()
})

const genreMongooseSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    }
})

exports.genreJoiSchema = genreJoiSchema;
exports.genreMongooseSchema = genreMongooseSchema;