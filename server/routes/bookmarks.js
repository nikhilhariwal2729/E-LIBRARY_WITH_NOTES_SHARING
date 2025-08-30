const router = require('express').Router();
const { auth } = require('../middleware/auth');
const { add, remove, list } = require('../controllers/bookmarkController');

router.get('/', auth, list);
router.post('/', auth, add);
router.delete('/', auth, remove);

module.exports = router;
