import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const UserSchema = new Schema ({
    firstName : {
        type : String, 
        required : "Enter First Name" 
        },
    lastName : {
         type : String,
         required : "Enter Last Name"
    },
    username : {
        type : String,
        required : "Enter Username",
        unique : true
    },
    email : {
        type : String,
        required : "Enter Email Address",
        unique : true,
        trim : true,
        lowercase : true,
    },
    password: {
        type : String,
        required : "Enter Password",
        trim : true
    },
})