import mongoose from 'mongoose';
import { UserSchema } from '../models/UserModel';

const User  = mongoose.model('Users', UserSchema);

export const getUserWithPWD = (req,res) => {
  User.findOne({ $and: [{ username: req.body.username }, { password : req.body.password }] }, (err, user) => {
    if (err) {
      res.send(err)
    }
    else {
      res.json(user)
    }
  })
}

export const addNewUser = (req, res) => {   
  let newUser = new User(req.body);
  newUser.save((err, user) => {
      if (err){
          res.send(err);
      }
      else{
        res.json({message : "Successfuly Added User"});
      }     
  })
}

export const deleteUser = (req,res) => {
  User.findOneAndDelete({ username : req.params.username }, (err, user) => {
    if (err) {
      res.send(err);      
    }
    else {
      res.json({message: "Successfuly Deleted User"})
    }
    })
}

export const getUserWithUsername = (req,res) => {
  User.findOne(req.params.username, (err, user) => {
    if (err) {
      res.send(err)
    }
    else {
      res.json(user)
    }
  })
}

export const getUserWithID = (req,res) => {
  User.findById(req.params.userID, (err, user) => {
    if (err) {
      res.send(err)
    }
    else{
      res.json(user)
    }
    })
}

export const getAllUser = (req, res) => {
  User.find({}, (err, user) => {
    if (err) {
      res.send(err);
    } else {
      res.json(user);
    }
  });
}