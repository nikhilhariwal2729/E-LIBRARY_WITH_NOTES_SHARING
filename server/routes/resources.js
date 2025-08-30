const router = require('express').Router();
const upload = require('../utils/upload');
const { auth } = require('../middleware/auth');
const { create, list, getOne, remove, incrementDownload } = require('../controllers/resourceController');

router.get('/', list);
router.get('/:id', getOne);
router.post('/', auth, upload.single('file'), create);
router.delete('/:id', auth, remove);
router.post('/:id/download', incrementDownload);

module.exports = router;
