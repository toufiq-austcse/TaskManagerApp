const express = require('express');
const router = new express.Router();
const Task = require('../models/task');
const User = require('../models/user');
const mongoose =require('../db/mongoose');
const auth = require('../midlewares/auth');

router.post('/tasks',auth,async (req,res)=>{
    //const task = new Task(req.body);
    const task = new Task({
        ...req.body,
        owner:req.user._id
    });
    try {
        await task.save();
        res.status(201).send(task);
    }catch (error) {
        res.status(400).send(error);
    }

});




router.get("/tasks",auth,async (req,res)=>{
    try {
        await req.user.populate('tasks').execPopulate();
        res.send(req.user.tasks);

    }catch (error) {
        res.status(500).send(error);
    }

});

router.get('/tasks/:id',auth,async (req,res)=>{
    const _id = req.params.id;
    try {
        const task = await Task.findOne({_id,owner:req.user._id});
        if(!task){
            return res.status(404).send()
        }
        res.send(task);

    }catch (error) {
        res.status(500).send(error);
    }

});

router.patch('/tasks/:id',auth ,async (req,res)=>{
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description','completed'];
    const isAllowedUpdated = updates.every(update => allowedUpdates.includes(update));

    if(!isAllowedUpdated){
        return res.status(404).send("Invalid update")
    }

    try {
        const task = await Task.findOne({_id:req.params.id,owner:req.user._id});

        //const task =await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
        if(!task){
            return res.status(404).send('Error')
        }
        updates.forEach(update => task[update] = req.body[update]);
        await task.save();
        res.send(task);


    }catch (error) {
        res.status(500).send(error);
    }
});
router.delete('/tasks/:id',auth,async (req,res)=>{
    try {
        const task =await Task.findOne({_id:req.params.id,owner:req.user._id});
        await task.remove();

        if(!task){
            return res.status(404).send();
        }

        res.send(task);

    }catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
