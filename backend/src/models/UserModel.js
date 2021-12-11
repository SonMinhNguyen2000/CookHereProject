import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  emailConfirmed: {
    type: Boolean,
    required: true,
    default: false,
  },
  emailToken: {
    type: String,
  },
  security: {
    tokens: [
      {
        refreshToken: String,
        createdAt: Date,
      },
    ],
    passwordReset: {
      token: {
        type: String,
        default: null,
      },
      provisionalPassword: {
        type: String,
        default: null,
      },
      expiry: {
        type: Date,
        default: null,
      },
    },
    changeEmail: {
      token: {
        type: String,
        default: null,
      },
      provisionalEmail: {
        type: String,
        default: null,
      },
      expiry: {
        type: String,
        default: null,
      },
    } ,
  }
});

module.exports = mongoose.model('User', userSchema);