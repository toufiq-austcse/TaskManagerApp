const express = require('express');
const mongoose =require('./db/mongoose');
const Task =require('./models/task');
const userRoute = require('./routes/user');
const taskRoute = require('./routes/task');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRoute);
app.use(taskRoute);

app.listen(port,()=>{
   console.log("Server is up on port "+port)
});



