require('../src/db/mongoose');

const Task = require('../src/models/task');

//5ce8413296369721982d5dd5

Task.findByIdAndDelete('5ce8413296369721982d5dd5').then(task=>{
    console.log(task);
    return Task.countDocuments({completed:false})
}).then(count=>{
    console.log(count);
}).catch(e=>{
    console.log(e)
});

const deleteTaskAndCount = async (id)=>{
    const task = await Task.findByIdAndDelete(id);
    const result = await Task.countDocuments({completed:false});
    return result;

};

deleteTaskAndCount('5ceb00fd153e4d313c3b9919').then(result=>{
    console.log(result);
}).catch(error =>{
    console.log(error)
})
