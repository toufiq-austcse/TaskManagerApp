const express = require('express');
const router = new express.Router();
const Task = require('../models/task');
const mongoose =require('../db/mongoose');

router.post('/tasks',async (req,res)=>{
    const task = new Task(req.body);
    try {
        await task.save();
        res.status(201).send(task);
    }catch (error) {
        res.status(400).send(error);
    }

});




router.get("/tasks",async (req,res)=>{
    try {
        const task =await Task.find({});
        res.send(task);
    }catch (error) {
        res.status(500).send(error);
    }

});

router.get('/tasks/:id',async (req,res)=>{
    const _id = req.params.id;
    try {
        const task = await Task.findById(_id);
        if(!task){
            return res.status(404).send()
        }
        res.send(task);

    }catch (error) {
        res.status(500).send(error);
    }

});

router.patch('/tasks/:id',async (req,res)=>{
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description','completed'];
    const isAllowedUpdated = updates.every(update => allowedUpdates.includes(update));

    if(!isAllowedUpdated){
        return res.status(404).send("Invalid update")
    }

    try {
        const task = await Task.findById(req.params.id);
        updates.forEach(update => task[update] = req.body[update]);
        await task.save();
        //const task =await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
        if(!task){
            return res.status(404).send('Error')
        }
        res.send(task);


    }catch (error) {
        res.status(500).send(error);
    }
});
router.delete('/tasks/:id',async (req,res)=>{
    try {
        const task =await Task.findByIdAndDelete(req.params.id);

        if(!task){
            return res.status(404).send();
        }

        res.send(task);

    }catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
