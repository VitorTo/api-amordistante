const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/join/:inviteCode', authController.joinWithInvite);
router.get('/verify-invite/:inviteCode', authController.verifyInvite);

module.exports = router; 