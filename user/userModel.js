const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    maxlength: [15, 'A username should not be longer than 15 characters.'],
    minlength: [3, 'A username should not be shorter than 3 characters.'],
    required: [true, 'A user should have a username.'],
    unique: [true, 'A user should have a unique username.']
  },
  name: {
    type: String,
    maxlength: [12, 'A name should not be longer than 12 characters.'],
    minlength: [3, 'A name should not be shorter than 3 characters.'],
    required: [true, 'A user should have a name.']
  },
  lastname: {
    type: String,
    maxlength: [15, 'A lastname should not be longer than 15 characters.'],
    minlength: [3, 'A lastname should not be shorter than 3 characters.'],
    required: [true, 'A user should have a lastname.']
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, 'The email is required to know you are real'],
    validate: [validator.isEmail, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false // to hide password field
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please Confirm your password'],
    validate: {
      // this only works on CREATE SAVE!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Password are not the same'
    }
  },
  description: {
    type: String,
    trim: true,
    maxlength: [250, 'A user description must be less than 250 characters.']
  },
  img_path: {
    type: String,
    default: '/img/user/profile.jpg'
  },
  cart: {
    type: Array,
    validate: {
      validator: validProducts,
      message: 'Could not be found all the products.'
    }
  },
  items: {
    type: Array,
    validate: {
      validator: validProducts,
      message: 'Could not be found all the products.'
    }
  },
  points: {
    type: Number,
    default: 0
  }
});
// middleware hook
userSchema.pre('save', async function (next) {
  // only run this function if passowrd was actually modified otherwise quit with calling return next()
  if (!this.isModified('password')) return next();
  // Hash the password with cose 12
  this.password = await bcrypt.hash(this.password, 12);
  // delete the confirmPassword field
  this.passwordConfirm= undefined;
  next();
});

// this is a instance method which we can call from anywhere within our apps
userSchema.methods.correctPassword =async function (candidatePassword,userPassword) {
  return await bcrypt.compare(candidatePassword,userPassword);
}

async function validProducts(ids) {
  const Product = require('./productModel')
  for (id of ids) {
    const product = await Product.findById(id)
    if (!product) {
      return product
    }
  }
  return true;
}

const User = mongoose.model('User', userSchema);

module.exports = User;