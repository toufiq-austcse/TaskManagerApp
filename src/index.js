const express = require('express');
const mongoose =require('./db/mongoose');
const Task =require('./models/task');
const User =require('./models/user');
const userRoute = require('./routes/user');
const taskRoute = require('./routes/task');

const app = express();
const port = process.env.PORT || 3000;

// app.use((req,res,next)=>{
//    if(req.method === 'GET'){
//       res.send('Get Request is disabled');
//    }
//    else {
//       next();
//    }
// });

// app.use((req,res,next)=>{
//    res.status(503).send('The server is under maintainence');
// });

app.use(express.json());
app.use(userRoute);
app.use(taskRoute);

app.listen(port,()=>{
   console.log("Server is up on port "+port)
});

//
// const jwt = require('jsonwebtoken');
//
// const myFunc = async ()=>{
//    const token = jwt.sign({_id:'dsfsdfds'},'thisistest',{expiresIn: '7 days'});
//    //console.log(token);
//    const data = jwt.verify(token,'thisistest');
//    console.log(data);
// };
// myFunc();


const main = async ()=>{
   // const task =await Task.findById('5cfe85911d0d674184ff6b1f');
   // await task.populate('owner').execPopulate();
   // console.log(task);

   const user = await User.findById('5cfe842063280e28acc36566');
   await user.populate('tasks').execPopulate();
   console.log(user.tasks);
};
main();
