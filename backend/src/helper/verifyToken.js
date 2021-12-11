const jwt = require('jsonwebtoken')
const User = require("../models/UserModel");

const auth = (req, res, next) => {
    try {
        const token = req.cookies.jwt.accessToken;
        const refreshToken = req.cookies.jwt.refreshToken;
        if (token && refreshToken) {
            jwt.verify(token, process.env.SECRET_ACCESS_TOKEN,(err, decoded)=>{
                if(err) {
                    //check if refresh token is valid, send new access token
                    jwt.verify(refreshToken, process.env.SECRET_REFRESH_TOKEN,async (err, decoded)=>{
                        if (err) {
                            res.status(400).json({error: {status: 400, message: "ACCESS_DENIED", error:"INVALID_REFRESH_TOKEN"}});
                        } else {
                            const user = await User.findOne({ email: decoded.email });
                            const existingRefreshTokens = user.security.tokens;
                            //check if refresh token is in the user document
                            if (
                                existingRefreshTokens.some(
                                    (token) => token.refreshToken === refreshToken
                                )
                            ) {
                                // Generate new Access Token
                                const accessToken = jwt.sign(
                                    {
                                        _id: user.id,
                                        email: user.email,
                                    },
                                    process.env.SECRET_ACCESS_TOKEN,
                                    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
                                );
                                //send new cookie with new access token
                                res.cookie('jwt', {accessToken: accessToken, refreshToken: refreshToken}, {
                                    httpOnly: true,
                                    secure: true
                                })
                                req.user = decoded;
                                next();
                            } else {
                                res.status(400).json({error: {status: 400, message: "ACCESS_DENIED"}});
                            }
                        }
                    })
                } else {
                    req.user = decoded
                    next();
                }
            })
        } else {
            res.status(400).json({error: {status: 400, message: "ACCESS_DENIED"}});
        }
    } catch(err) {
        res.status(402).json({error: {status: 400, message: "ACCESS_DENIED"}});
    }
}

module.exports = {auth}