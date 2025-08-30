const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true, index: 'text' },
  description: { type: String, default: '' },
  subject: { type: String, required: true, index: true },
  tags: [{ type: String, index: true }],
  filePath: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  status: { type: String, enum: ['approved', 'pending', 'rejected'], default: 'pending', index: true },
  downloadsCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema);
