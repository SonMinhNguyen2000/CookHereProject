const User = require("../models/UserModel");
const jwt = require('jsonwebtoken');
const validation = require('../helper/validation');
const bcrypt = require('bcrypt');
const {v4: uuidv4} = require('uuid')
const nodemailer = require("nodemailer");

// const moment = require('moment');

const register = async(req, res) => {
  try{
    //checking input
    const {error} = validation.registerSchema.validate(req.body, {
      abortEarly: false
    })
    if (error) {//if invalid input
      res.status(400).json({
        error: {
          status: 400,
          message: "INPUT_ERRORS",
          errors: error.details,
          original: error._original
        }
      });
    } else {
      //hashed the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      const user = new User({
        username:req.body.username, 
        email: req.body.email,
        password:hashedPassword,
        emailConfirmed: false, 
        emailToken: uuidv4(),
        security: {
          tokens: [],
          passwordReset: {
            token: null,
            provisionalPassword: null,
            expiry: null
          }
        } 
      });
      //save new user to db
      await user.save();
      //generate tokens
      const accessToken = jwt.sign(
        {
          _id: user.id,
          email: user.email,
        },
        process.env.SECRET_ACCESS_TOKEN,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
      );
      const refreshToken = jwt.sign({
        _id: user.id,
        email: user.email
      }, 
      process.env.SECRET_REFRESH_TOKEN, 
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY}
      );
      //assign token to user 
      await User.updateOne({email: user.email}, {
        $push: {
          "security.Tokens": {
            refreshToken: refreshToken,
            createdAt: new Date()
          }
        }
      });
      //send Email Confirmation 
      await sendEmailConfirmation(user)

      res
        .status(200)
        .header()
        .json({
          success: {
            status: 200,
            message: "REGISTER_SUCCESS",
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: {
              id: user.id,
              email: user.email,
            },
          },
        });
    }
  }catch(err) {
    let errorMessage = {emailErr: "", usernameErr:"", passwordErr:""};
    if (err.keyPattern.email === 1) {
      errorMessage.emailErr = "EMAIL_EXISTS";
    }
    if(err.keyPattern.username === 1) {
      errorMessage.usernameErr = "USERNAME_EXISTS"
    }
    if(err.keyPattern.password === 1) {
      errorMessage.passwordErr = "INVALID_PASSWORD"
    }
    res.status(400).json({error: {status: 400, message: errorMessage}});
  }
}

const login = async(req,res) => {
  try {
    const {error} = validation.loginSchema.validate(req.body);
    if (error) {//check input
      res.status(400).json({
        error: {
          status: 400,
          message: "INPUT_ERRORS", 
          errors: error.details, 
          original: error._original
        }
      });
    } else {
      //check if user with login email exist
      const user = await User.findOne({email: req.body.email});
      if (user) {
        //if email exist => check if email is confirmed
        if (user.emailConfirmed) {
          const validatePassword = await bcrypt.compare(req.body.password,user.password)
          if (validatePassword) {
            //if password correct => generate token
            const accessToken = jwt.sign({
                  _id: user.id,
                  email: user.email
                },
                process.env.SECRET_ACCESS_TOKEN,
                {expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
            );
            const refreshToken = jwt.sign({
                  _id: user.id,
                  email: user.email
                },
                process.env.SECRET_REFRESH_TOKEN,
                {expiresIn: process.env.REFRESH_TOKEN_EXPIRY}
            );
            //assign refresh token to user document
            if (await addRefreshToken(user, refreshToken)) {
              res.cookie('jwt', {accessToken: accessToken, refreshToken: refreshToken}, {
                httpOnly: true,
                secure: true
              })
              res
                  .status(200)
                  .json({
                    success: {
                      status: 200,
                      message: "LOGIN_SUCCESS",
                      username: user.username,
                      email: user.email
                    }
                  })
            } else {
              res.status(500).json({error: {status: 500, message: "SERVER_ERROR"}});
            }
          } else {
            res.status(403).json({error: {status: 403, message: "INCORRECT_PASSWORD"}})
          }
        } else {
          res.status(400).json({error: {status: 403, message: "PLEASE_CONFIRM_YOUR_EMAIL_FIRST"}})
        }
      } else {
        res.status(403).json({error: {status: 403, message: "EMAIL_NOT_EXIST"}})
      }
    }
  } catch(err) {
    res.status(500).json({error: {status: 500, message: "BAD_REQUEST"}})
  }
}

const addRefreshToken = async(user, refreshToken) => {
  try {
    const existingRefreshTokens = user.security.tokens;
    
    //check if there are less than 5 refresh tokens 
    if (existingRefreshTokens.length<5) {//if it's less than 5 tokens, add new token to token array
      await User.updateOne({email: user.email},{
        $push: {
          "security.tokens": {
            refreshToken: refreshToken, 
            createdAt: new Date()
          }
        }
      });
    } else {//else remove the oldest token and add new one 
      await User.updateOne({email: user.email}, {
        $pull: {
          "security.tokens": {
            _id: existingRefreshTokens[0]._id
          }
        }
      });
      await User.updateOne(
        { email: user.email },
        {
          $push: {
            "security.tokens": {
              refreshToken: refreshToken,
              createdAt: new Date(),
            },
          },
        }
      );
    }
    return true;
  } catch (err) {
    return false
  }
}

const sendEmailConfirmation = async({email,username,emailToken}) => {
  let transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS,
      clientId: process.env.NODEMAILER_CLIENTID,
      clientSecret: process.env.NODEMAILER_CLIENTSECRET,
      refreshToken: process.env.NODEMAILER_REFRESHTOKEN,
    },
  });
  const info = await transport.sendMail({
    from: '"CookHere Test" <noreply@CookHere.ca>',
    to: email,
    subject: "Confirm Your Email",
    html: `<p>Click the link to confirm your email:</p>
    <a>http://localhost:4000/api/auth/emailConfirmation/${username}/${emailToken}</a>`,
  });
}                                        

const verifyEmailToken = async(req,res) => {
  try {
    const emailToken = req.params.emailToken;
    if (emailToken!==null) {
      const user = await User.findOne({username: req.params.username});
      if (user) {
        if (!user.emailConfirmed) {
          await User.updateOne(
            { username: req.params.username },
            {
              $set: {
                emailConfirmed: true,
                emailToken: null,
              },
            }
          );
          res.send(`<div style="margin: auto; text-align: center;">Email Confirmed</div>`)
        } else {
          res
            .status(401)
            .json({
              error: { status: 401, message: "EMAIL_ALREADY_CONFIRMED"},
            });
        }
      } else {
        res.status(400).json({error: {status: 400, message: "INVALID_USER"}})
      }
    } else {
      res.status(400).json({error: {status: 400, message: "INVALID_EMAIL_TOKEN"}})
    }
  } catch(err) {
    res.status(400).json({error: {status: 400, message: "BAD_REQUEST"}});
  }
}

const getUserEmail = async(req, res) => {
  res.status(200).json({success:{status: 200, email: req.user.email}})
}

const logout = async (req, res) => {
  // Set token to none and expire after 5 seconds
  res.cookie('jwt', 'none', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  })
  res.status(200).json({ success: {status:200, message: 'User logged out successfully'}})
}

// const sendResetPasswordConfirm = async({email, passwordResetToken}) => {
//   let transport = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       type: "OAuth2",
//       user: process.env.NODEMAILER_USER,
//       pass: process.env.NODEMAILER_PASS,
//       clientId: process.env.NODEMAILER_CLIENTID,
//       clientSecret: process.env.NODEMAILER_CLIENTSECRET,
//       refreshToken: process.env.NODEMAILER_REFRESHTOKEN,
//     },
//   });
//   const info = await transport.sendMail({
//     from: '"CookHere Test" <noreply@CookHere.ca>',
//     to: email,
//     subject: "Confirm Your Email",
//     html: `<p>Click the link to cofirm reset your password:</p>
//     <a>http://localhost:4000/api/auth/resetPasswordConfirmation/${passwordResetToken}</a>`,
//   });
// }

// const resetPassword = async(req, res) => {
//   try {
//     if (req.body.provisionalPassword.length>=6&& req.body.provisionalPassword.length<=255) {
//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash(req.body.provisionalPassword, salt);
//       const passwordResetToken = uuidv4();
//       const expiresIn = moment.add(10,"m").toISOString();
//       const user = await User.findOneAndUpdate(
//         {email: req.body.email},
//         {
//           $set: {
//             "security.passwordReset": {
//               token: passwordResetToken,
//               provisionalPassword: hashedPassword,
//               expiry: expiresIn
//             }
//           }
//         }
//       );
//       await sendResetPasswordConfirm({email: req.body.email, passwordResetToken: passwordResetToken})
//       res.status(200).json({success: {status: 200, message: "PASSWORD_RESET_EMAIL_SENT"}})
//     } else {
//       res.status(400).json({error: {status: 400, message: "PASSWORD_INVALID"}})
//     }
//   } catch(err) {
//     res.status(400).json({error: {status: 400, message: "BAD_REQUEST"}})
//   }
// }

// const verifyPasswordToken = async(req, res) => {
//   try {
//     const user = await User.findOne({id: req.params.id})
//     if (user.security.passwordReset.token === req.params.passwordResetToken) {
//       if (new Date().getTime()<= new Date(user.security.passwordReset.expiry).getTime()) {
//         await User.updateOne({id: req.params.id},{
//           $set: {
//             password: user.security.passwordReset.provisionalPassword, 
//             "security.passwordReset.token": null,
//             "security.passwordReset.provisionalPassword": null,
//             "security.passwordReset.expiry": null
//           }
//         });
//         res.status(200).json({success:{status: 200, message: "PASSWORD_RESET_SUCCESS"}})
//       } else {
//         res.status(401).json({error: {status: 401, message: "PASSWORD_RESET_TOKEN_EXPIRED"}})
//       }
//     } else {
//       res.status(400).json({error: {status: 400, message: "INVALID_TOKEN"}})
//     }
//   } catch(err) {
//     res.status(400).json({error: {status: 400, message: "BAD_REQUEST"}})
//   }//a function that take in refresh token and then generate a new access token
// }

module.exports = {register, login, verifyEmailToken, getUserEmail, logout};