const router = require('express').Router();
const { auth } = require('../middleware/auth');
const { add, list } = require('../controllers/commentController');

router.get('/', list);
router.post('/', auth, add);

module.exports = router;
