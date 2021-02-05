const mongoose = require('mongoose');
const Joi = require('Joi');
Joi.objectId = require('joi-objectid')(Joi);


const rentalMongooseSchema = new mongoose.Schema({
    customer:{
        type:new mongoose.Schema({
            name:{
                type:String,
                required:true
            },
            isGold:{
                type:Boolean,
                required:true
            }
        }),
        required:true
    },
    movie: {
        type:new mongoose.Schema({
            title:{
                type:String,
                required:true
            },
            dailyRentalRate:{
                type:Number,
                required:true
            }
        }),
        required:true
    },
    dateOut:{
        type: Date,
        required:true,
        default:Date.now
    },
    dateReturned:{
        type:Date,
        validate:(v)=>{
            return v>this.dateOut;
        }
    },
    rentalFee:{
        type:Number,
        min:0,
    }
})

const rentalJoiSchema = Joi.object({
    customerId : Joi.objectId().required(),
    movieId:Joi.objectId().required()
})

exports.rentalMongooseSchema = rentalMongooseSchema;
exports.rentalJoiSchema = rentalJoiSchema;