const mongoose = require('mongoose');
const Joi = require('Joi');


const customerJoiSchema = Joi.object({
    isGold: Joi.required(),
    name:Joi.string().required(),
    phone:Joi.string().required()
});

const customerMongooseSchema = new mongoose.Schema({
    isGold:{
        type:Boolean,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true,
        minlength:10
    }
});

module.exports.customerJoiSchema = customerJoiSchema;
module.exports.customerMongooseSchema = customerMongooseSchema;