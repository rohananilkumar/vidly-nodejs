const auth = require('../middleware/auth');
const _ = require('lodash');
const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const {userMongooseSchema:mongooseSchema, userJoiSchema:joiSchema} = require('../models/user');

const router = express.Router();

User = mongoose.model("User", mongooseSchema);

router.get('/me',auth, async (req, res)=>{
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
})

//Registering users
router.post('/',async (req,res)=>{
    console.log("Post request");

    const {error, value} = joiSchema.validate(req.body);

    if(error){
        res.status(400).send(error);
        return;
    }

    let user = await User.findOne({email:value.email});
    if(user) return res.status(400).send('User already registered.');

    user = new User(_.pick(value,['name','email','password']));
    //Pick returns the objects with only the specific keys

    //Hashing
    const salt = await bcrypt.genSalt(10);  
    user.password = await bcrypt.hash(user.password,salt)

    await user.save();
    //Use joi-password-complexity to enforce constraints on the passwords that is being sent

    const token = user.generateAuthToken(); //This function creates the authentication token and returns it
    
    //Send the authentication token with header
    res.header('x-auth-token',token).status(201).send(_.pick(user,['name','email','_id']));
    
});



module.exports = router;