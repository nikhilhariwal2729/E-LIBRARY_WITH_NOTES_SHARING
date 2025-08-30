const Comment = require('../models/Comment');

const add = async (req, res) => {
  const { resourceId, comment } = req.body;
  const c = await Comment.create({ resourceId, userId: req.user.id, comment });
  return res.status(201).json(c);
};

const list = async (req, res) => {
  const { resourceId } = req.query;
  const items = await Comment.find({ resourceId }).populate('userId', 'name role').sort({ createdAt: -1 });
  return res.json(items);
};

module.exports = { add, list };
