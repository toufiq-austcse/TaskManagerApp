require('../src/db/mongoose');

const User = require('../src/models/user');

//5ce853c982c77608e0435c4c

// User.findByIdAndUpdate('5ce853c982c77608e0435c4c',{age:35}).then((user)=>{
//     console.log(user)
//     return User.countDocuments({age:35})
// }).then((count)=>{
//     console.log(count);
// }).catch(e=>{
//     console.log(e)
// });

const updateAgeAndCount = async (id,age)=>{
   const user = await User.findByIdAndUpdate(id,{age:age});
   const count= await User.countDocuments({age:age});
   return count;
};

updateAgeAndCount('5ce853c982c77608e0435c4c',35).then((result)=>{
    console.log(result);
}).catch((error)=>{
    console.log(e,error);
})
