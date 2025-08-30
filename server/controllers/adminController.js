const User = require('../models/User');
const Resource = require('../models/Resource');

const approve = async (req, res) => {
  const { id } = req.params;
  const r = await Resource.findByIdAndUpdate(id, { status: 'approved' }, { new: true });
  if (!r) return res.status(404).json({ message: 'Not found' });
  return res.json(r);
};

const reject = async (req, res) => {
  const { id } = req.params;
  const r = await Resource.findByIdAndUpdate(id, { status: 'rejected' }, { new: true });
  if (!r) return res.status(404).json({ message: 'Not found' });
  return res.json(r);
};

const pending = async (req, res) => {
  const items = await Resource.find({ status: 'pending' }).populate('uploadedBy', 'name role');
  return res.json(items);
};

const users = async (req, res) => {
  const items = await User.find().select('-password');
  return res.json(items);
};

const block = async (req, res) => {
  const u = await User.findByIdAndUpdate(req.params.id, { isBlocked: true }, { new: true }).select('-password');
  if (!u) return res.status(404).json({ message: 'Not found' });
  return res.json(u);
};

const unblock = async (req, res) => {
  const u = await User.findByIdAndUpdate(req.params.id, { isBlocked: false }, { new: true }).select('-password');
  if (!u) return res.status(404).json({ message: 'Not found' });
  return res.json(u);
};

const stats = async (req, res) => {
  const topDownloads = await Resource.find({ status: 'approved' }).sort({ downloadsCount: -1 }).limit(10).select('title downloadsCount');
  const bySubject = await Resource.aggregate([
    { $match: { status: 'approved' } },
    { $group: { _id: '$subject', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
  return res.json({ topDownloads, bySubject });
};

module.exports = { approve, reject, pending, users, block, unblock, stats };
