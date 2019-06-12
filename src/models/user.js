const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const task = require('../models/task');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique:true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("In valid Email")
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error("Age must be a positive number");
            }
        }
    },
    password: {
        type: String,
        required:true,
        trim:true,
        minlength:7,

        validate(value){
            if(value.toLowerCase().includes("password")){
                throw new Error("invalid password")
            }
        }

    },
    avatar:{
      type:Buffer
    },
    tokens:[{
        token: {
            type:String,
            required:true
        }
    }]
});

userSchema.virtual('tasks',{
    ref:'Task',
    foreignField:'owner',
    localField:'_id'
});

userSchema.methods.generateAuthToken = async function(){
  const user = this;
  const token = jwt.sign({_id:user._id.toString()},'thisistoken');
  user.tokens = user.tokens.concat(
      {
          token
      }
  );
  user.save();
  return token;
};

/*
* @hidng private data
* */


// userSchema.methods.getPublicProfile = function(){
//   const user = this;
//   const userObject = user.toObject();
//   delete userObject.password;
//   delete userObject.tokens;
//   return userObject;
// };

userSchema.methods.toJSON = function(){
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;
    return userObject;
};

userSchema.statics.findByCredentials = async (email,password)=>{
    const user =await User.findOne({email});
    if(!user){
        throw new Error('Unable to login');
    }

    const isMatch =await bcrypt.compare(password,user.password);

    if(!isMatch){
        throw new Error('Unable to login');
    }

    return user;
};

//hash the plain text password
userSchema.pre('save',async function (next) {
    const user = this;
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8);
    }
    next();
});

userSchema.pre('remove',async function (next) {

    let user = this;
    await task.deleteMany({owner:user._id});
    next();
});
const User = mongoose.model("User",userSchema );
module.exports = User;
