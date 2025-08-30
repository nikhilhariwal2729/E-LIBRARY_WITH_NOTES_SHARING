const Rating = require('../models/Rating');

const rate = async (req, res) => {
  const { resourceId, rating } = req.body;
  const r = await Rating.findOneAndUpdate({ resourceId, userId: req.user.id }, { rating }, { upsert: true, new: true, setDefaultsOnInsert: true });
  return res.status(201).json(r);
};

module.exports = { rate };
