const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const mongoose =require('../db/mongoose');

router.post('/users',async (req,res)=>{
    const user = new User(req.body);
    try{
        await user.save();
        res.status(201).send(user);
    }catch (e) {
        res.status(400).send(e);
    }

});

router.get('/users',async (req,res)=>{
    try {
        const users =await User.find({});
        res.send(users);

    }catch (error) {
        res.status(500).error(error);
    }
});
router.get("/users/:id",async (req,res)=>{
    const _id = req.params.id;

    try {
        const user =await User.findById(_id);
        if(!user){
            return res.status(404).send()
        }
        res.send(user);

    }catch (error) {
        res.status(500).send(error);
    }



});

router.patch('/users/:id',async (req,res)=>{
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name','email','password','age'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    if(!isValidOperation){
        return res.status(404).send("Invalid update")
    }

    try {
        const user = await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
        if(!user){
            return res.status(404).send('Error')
        }
        res.send(user);
    }catch (error) {
        res.status(500).send(error);
    }
});

router.delete('/users/:id',async (req,res)=>{
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if(!user){
            return res.status(404).send()
        }
        res.send(user);
    }catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
