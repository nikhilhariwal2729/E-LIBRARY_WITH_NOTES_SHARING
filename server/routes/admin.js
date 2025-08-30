const router = require('express').Router();
const { auth, permit } = require('../middleware/auth');
const { approve, reject, pending, users, block, unblock, stats } = require('../controllers/adminController');

router.use(auth, permit('admin'));
router.get('/pending', pending);
router.post('/approve/:id', approve);
router.post('/reject/:id', reject);
router.get('/users', users);
router.post('/block/:id', block);
router.post('/unblock/:id', unblock);
router.get('/stats', stats);

module.exports = router;
