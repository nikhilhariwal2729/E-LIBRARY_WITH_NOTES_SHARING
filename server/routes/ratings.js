const router = require('express').Router();
const { auth } = require('../middleware/auth');
const { rate } = require('../controllers/ratingController');

router.post('/', auth, rate);

module.exports = router;
