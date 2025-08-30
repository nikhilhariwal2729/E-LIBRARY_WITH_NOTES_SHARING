const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  resourceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource', required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  rating: { type: Number, min: 1, max: 5, required: true }
}, { timestamps: true });

ratingSchema.index({ resourceId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);
