const express = require('express');
const Joi = require('Joi');
const mongoose = require('mongoose');
const {customerMongooseSchema:mongooseSchema, customerJoiSchema:joiSchema} = require('../models/customer');
//const router = require('./genres');

const router=express.Router();

const Customer = mongoose.model("Customer",mongooseSchema);

router.get('/',async (req, res)=>{
    const customers = await Customer.find();
    res.send(customers);
})

router.get('/:id',async (req, res)=>{
    const customer = await Customer.findById(req.params.id);
    if(!customer){
        res.status(404).send("Customer object could not be found");
        return;
    }
    res.send(customer);
})

router.post('/',async (req,res)=>{
    const {error, value} = joiSchema.validate(req.body);
    if(error){
        console.log(error);
        res.status(400).send("Invalid Customer object");
        return;
    }
    const customer = new Customer({
        name:value.name,
        isGold:value.isGold,
        phone:value.phone
    });

    await customer.save()

    res.status(201).send(customer);
})

router.put('/:id',async (req,res)=>{
    const customer = await Customer.findById(req.params.id);
    if(!customer){
        res.status(404).send("Customer object could not be found");
        return;
    }
    const {error, value} = joiSchema.validate(req.body);
    if(error){
        console.log(error);
        res.status(400).send("Invalid Customer object");
        return;
    }
    customer.set({
        name:value.name,
        isGold:value.isGold,
        phone:value.phone
    })

    const result = await customer.save()

    res.status(201).send(result);
})

router.delete('/:id', async (req,res)=>{
    const customer = await Customer.findById(req.params.id);
    if(!customer){
        res.status(404).send("Customer object could not be found");
    }

    const deleted = await Customer.deleteOne({_id:req.params.id});
    res.status(200).send(deleted);
})


module.exports = router;