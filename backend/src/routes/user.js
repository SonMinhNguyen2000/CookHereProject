const express = require('express');
const controller = require('../controllers/UserController')
const verifyToken = require('../helper/verifyToken')
const router = express.Router();

router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/emailConfirmation/:username/:emailToken', controller.verifyEmailToken);
router.get('/logout', verifyToken.auth, controller.logout);
router.get('/email', verifyToken.auth, controller.getUserEmail);
// router.get('/resetPassword', controller.resetPassword)
// router.get('/resetPasswordConfirmation/:passwordResetToken')

module.exports = router