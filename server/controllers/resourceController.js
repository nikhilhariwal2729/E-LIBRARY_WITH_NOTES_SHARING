const Resource = require('../models/Resource');
const Rating = require('../models/Rating');
const path = require('path');

const create = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'File required' });
  const { title, description, subject, tags } = req.body;
  const resource = await Resource.create({
    title,
    description,
    subject,
    tags: tags ? (Array.isArray(tags) ? tags : String(tags).split(',').map(t => t.trim()).filter(Boolean)) : [],
    filePath: path.join('uploads', path.basename(req.file.path)),
    uploadedBy: req.user.id,
    status: req.user.role === 'admin' ? 'approved' : 'pending'
  });
  return res.status(201).json(resource);
};

const list = async (req, res) => {
  const { q, subject, tags, uploader, status, sortBy = 'createdAt', order = 'desc' } = req.query;
  const filter = {};
  if (subject) filter.subject = subject;
  if (uploader) filter.uploadedBy = uploader;
  // Default to only approved items when no status filter is provided
  if (status) filter.status = status;
  else filter.status = 'approved';
  if (tags) filter.tags = { $in: String(tags).split(',').map(t => t.trim()) };
  if (q) filter.$text = { $search: q };
  const sort = { [sortBy]: order === 'asc' ? 1 : -1 };
  const items = await Resource.find(filter).populate('uploadedBy', 'name role').sort(sort).limit(100);
  const avgRatings = await Rating.aggregate([
    { $match: { resourceId: { $in: items.map(i => i._id) } } },
    { $group: { _id: '$resourceId', avg: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);
  const ratingById = Object.fromEntries(avgRatings.map(r => [String(r._id), { avg: r.avg, count: r.count }]));
  return res.json(items.map(i => ({ ...i.toObject(), rating: ratingById[String(i._id)] || { avg: 0, count: 0 } })));
};

const getOne = async (req, res) => {
  const item = await Resource.findById(req.params.id).populate('uploadedBy', 'name role');
  if (!item) return res.status(404).json({ message: 'Not found' });
  return res.json(item);
};

const remove = async (req, res) => {
  const item = await Resource.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  if (String(item.uploadedBy) !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  await item.deleteOne();
  return res.json({ message: 'Deleted' });
};

const incrementDownload = async (req, res) => {
  const item = await Resource.findByIdAndUpdate(req.params.id, { $inc: { downloadsCount: 1 } }, { new: true });
  if (!item) return res.status(404).json({ message: 'Not found' });
  return res.json({ downloadsCount: item.downloadsCount });
};

module.exports = { create, list, getOne, remove, incrementDownload };
