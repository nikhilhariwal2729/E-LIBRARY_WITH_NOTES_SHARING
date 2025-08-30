const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const User = require('../models/User');
const Resource = require('../models/Resource');
const Comment = require('../models/Comment');
const Rating = require('../models/Rating');
const Bookmark = require('../models/Bookmark');
const bcrypt = require('bcrypt');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const ensureUser = async (name, email, password, role) => {
      let u = await User.findOne({ email });
      if (!u) {
        u = await User.create({ name, email, password: await bcrypt.hash(password, 10), role });
      }
      return u;
    };

    const admin = await ensureUser('Admin', 'admin@elibrary.com', 'admin123', 'admin');
    const teacher = await ensureUser('Teacher', 'teacher@elibrary.com', 'teacher123', 'teacher');
    const student = await ensureUser('Student', 'student@elibrary.com', 'student123', 'student');

    const existing = await Resource.findOne({ title: 'Algebra Essentials' });
    if (!existing) {
      const r1 = await Resource.create({
        title: 'Algebra Essentials',
        description: 'Concise notes covering key algebra concepts with examples.',
        subject: 'Mathematics',
        tags: ['algebra','basics','equations'],
        filePath: 'https://arxiv.org/pdf/2107.00001.pdf',
        uploadedBy: teacher._id,
        status: 'approved',
        downloadsCount: 12,
      });
      const r2 = await Resource.create({
        title: 'World History Summary',
        description: 'A quick overview of major world history events.',
        subject: 'History',
        tags: ['history','timeline'],
        filePath: 'https://arxiv.org/pdf/2001.00001.pdf',
        uploadedBy: teacher._id,
        status: 'approved',
        downloadsCount: 7,
      });
      const r3 = await Resource.create({
        title: 'Physics: Mechanics Formula Sheet',
        description: 'Handy formula sheet for mechanics problems.',
        subject: 'Physics',
        tags: ['physics','mechanics','formulas'],
        filePath: 'https://arxiv.org/pdf/1810.00001.pdf',
        uploadedBy: student._id,
        status: 'pending',
        downloadsCount: 2,
      });

      await Comment.create({ resourceId: r1._id, userId: student._id, comment: 'These notes are super clear. Thanks!' });
      await Comment.create({ resourceId: r1._id, userId: teacher._id, comment: 'Added a section on quadratic equations.' });

      await Rating.create({ resourceId: r1._id, userId: student._id, rating: 5 });
      await Rating.create({ resourceId: r2._id, userId: student._id, rating: 4 });

      await Bookmark.create({ userId: student._id, resourceId: r1._id });
    }

    console.log('Seed complete.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
