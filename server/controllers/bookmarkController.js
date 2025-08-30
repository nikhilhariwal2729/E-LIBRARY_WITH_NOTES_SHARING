const Bookmark = require('../models/Bookmark');

const add = async (req, res) => {
  const { resourceId } = req.body;
  const b = await Bookmark.findOneAndUpdate({ userId: req.user.id, resourceId }, { userId: req.user.id, resourceId }, { upsert: true, new: true, setDefaultsOnInsert: true });
  return res.status(201).json(b);
};

const remove = async (req, res) => {
  const { resourceId } = req.body;
  await Bookmark.findOneAndDelete({ userId: req.user.id, resourceId });
  return res.json({ message: 'Removed' });
};

const list = async (req, res) => {
  const items = await Bookmark.find({ userId: req.user.id }).populate('resourceId');
  return res.json(items);
};

module.exports = { add, remove, list };
