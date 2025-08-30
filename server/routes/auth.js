const router = require('express').Router();
const { signup, login, me, logout, signupValidators, loginValidators } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

router.post('/signup', signupValidators, signup);
router.post('/login', loginValidators, login);
router.get('/me', auth, me);
router.post('/logout', auth, logout);

module.exports = router;
