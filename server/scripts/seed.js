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

    const existing = await Resource.findOne({ title: 'Advanced Calculus and Differential Equations' });
    if (!existing) {
      // Engineering Mathematics Books
      const r1 = await Resource.create({
        title: 'Advanced Calculus and Differential Equations',
        description: 'Comprehensive guide to calculus and differential equations with engineering applications. Covers multivariable calculus, partial differential equations, and numerical methods.',
        subject: 'Engineering Mathematics',
        tags: ['calculus','differential-equations','mathematics','engineering'],
        filePath: 'https://arxiv.org/pdf/2107.00001.pdf',
        uploadedBy: teacher._id,
        status: 'approved',
        downloadsCount: 45,
      });
      
      const r2 = await Resource.create({
        title: 'Linear Algebra for Engineers',
        description: 'Essential linear algebra concepts for engineering students. Includes vector spaces, eigenvalues, matrix theory, and applications in signal processing.',
        subject: 'Engineering Mathematics',
        tags: ['linear-algebra','matrices','vectors','engineering'],
        filePath: 'https://arxiv.org/pdf/2001.00001.pdf',
        uploadedBy: teacher._id,
        status: 'approved',
        downloadsCount: 38,
      });

      // Mechanical Engineering Books
      const r3 = await Resource.create({
        title: 'Thermodynamics: Principles and Applications',
        description: 'Complete thermodynamics theory covering laws of thermodynamics, heat transfer, entropy, and thermodynamic cycles. Essential for mechanical engineering.',
        subject: 'Mechanical Engineering',
        tags: ['thermodynamics','heat-transfer','mechanical','energy'],
        filePath: 'https://arxiv.org/pdf/1810.00001.pdf',
        uploadedBy: teacher._id,
        status: 'approved',
        downloadsCount: 52,
      });

      const r4 = await Resource.create({
        title: 'Fluid Mechanics and Hydraulics',
        description: 'Comprehensive fluid mechanics covering Bernoulli\'s equation, viscosity, turbulence, pipe flow, and hydraulic systems design.',
        subject: 'Mechanical Engineering',
        tags: ['fluid-mechanics','hydraulics','bernoulli','turbulence'],
        filePath: 'https://arxiv.org/pdf/1905.00001.pdf',
        uploadedBy: teacher._id,
        status: 'approved',
        downloadsCount: 41,
      });

      const r5 = await Resource.create({
        title: 'Machine Design and Analysis',
        description: 'Theory and practice of machine design including stress analysis, fatigue, bearings, gears, and mechanical systems design principles.',
        subject: 'Mechanical Engineering',
        tags: ['machine-design','stress-analysis','fatigue','gears'],
        filePath: 'https://arxiv.org/pdf/1903.00001.pdf',
        uploadedBy: teacher._id,
        status: 'approved',
        downloadsCount: 67,
      });

      // Electrical Engineering Books
      const r6 = await Resource.create({
        title: 'Circuit Analysis and Design',
        description: 'Fundamental electrical circuit theory covering Ohm\'s law, Kirchhoff\'s laws, AC/DC analysis, and circuit design principles.',
        subject: 'Electrical Engineering',
        tags: ['circuits','ohm-law','kirchhoff','electrical'],
        filePath: 'https://arxiv.org/pdf/1809.00001.pdf',
        uploadedBy: teacher._id,
        status: 'approved',
        downloadsCount: 58,
      });

      const r7 = await Resource.create({
        title: 'Digital Signal Processing Theory',
        description: 'Advanced DSP concepts including Fourier transforms, filtering, sampling theory, and digital communication systems.',
        subject: 'Electrical Engineering',
        tags: ['signal-processing','fourier','filtering','digital'],
        filePath: 'https://arxiv.org/pdf/1807.00001.pdf',
        uploadedBy: teacher._id,
        status: 'approved',
        downloadsCount: 43,
      });

      const r8 = await Resource.create({
        title: 'Control Systems Engineering',
        description: 'Control theory fundamentals covering feedback systems, stability analysis, PID controllers, and system response characteristics.',
        subject: 'Electrical Engineering',
        tags: ['control-systems','feedback','stability','pid'],
        filePath: 'https://arxiv.org/pdf/1805.00001.pdf',
        uploadedBy: teacher._id,
        status: 'approved',
        downloadsCount: 49,
      });

      // Civil Engineering Books
      const r9 = await Resource.create({
        title: 'Structural Analysis and Design',
        description: 'Structural engineering principles covering beam theory, truss analysis, concrete design, and steel structures.',
        subject: 'Civil Engineering',
        tags: ['structural-analysis','beam-theory','concrete','steel'],
        filePath: 'https://arxiv.org/pdf/1803.00001.pdf',
        uploadedBy: teacher._id,
        status: 'approved',
        downloadsCount: 55,
      });

      const r10 = await Resource.create({
        title: 'Geotechnical Engineering Fundamentals',
        description: 'Soil mechanics and foundation engineering covering soil properties, bearing capacity, slope stability, and foundation design.',
        subject: 'Civil Engineering',
        tags: ['geotechnical','soil-mechanics','foundations','slope-stability'],
        filePath: 'https://arxiv.org/pdf/1801.00001.pdf',
        uploadedBy: teacher._id,
        status: 'approved',
        downloadsCount: 36,
      });

      // Computer Science/Software Engineering
      const r11 = await Resource.create({
        title: 'Data Structures and Algorithms',
        description: 'Essential computer science concepts covering arrays, linked lists, trees, graphs, sorting algorithms, and complexity analysis.',
        subject: 'Computer Science',
        tags: ['data-structures','algorithms','programming','complexity'],
        filePath: 'https://arxiv.org/pdf/1709.00001.pdf',
        uploadedBy: student._id,
        status: 'approved',
        downloadsCount: 72,
      });

      const r12 = await Resource.create({
        title: 'Database Systems Design',
        description: 'Database theory and design covering relational models, SQL, normalization, indexing, and distributed databases.',
        subject: 'Computer Science',
        tags: ['databases','sql','normalization','relational'],
        filePath: 'https://arxiv.org/pdf/1707.00001.pdf',
        uploadedBy: student._id,
        status: 'approved',
        downloadsCount: 48,
      });

      // Comments and Ratings
      await Comment.create({ resourceId: r1._id, userId: student._id, comment: 'Excellent explanation of differential equations with practical examples!' });
      await Comment.create({ resourceId: r1._id, userId: teacher._id, comment: 'Added more engineering applications in the latest version.' });
      await Comment.create({ resourceId: r3._id, userId: student._id, comment: 'Perfect for understanding thermodynamic cycles and heat engines.' });
      await Comment.create({ resourceId: r6._id, userId: student._id, comment: 'Great circuit analysis examples with step-by-step solutions.' });
      await Comment.create({ resourceId: r11._id, userId: teacher._id, comment: 'Comprehensive coverage of algorithms with complexity analysis.' });

      // Ratings
      await Rating.create({ resourceId: r1._id, userId: student._id, rating: 5 });
      await Rating.create({ resourceId: r2._id, userId: student._id, rating: 4 });
      await Rating.create({ resourceId: r3._id, userId: student._id, rating: 5 });
      await Rating.create({ resourceId: r4._id, userId: student._id, rating: 4 });
      await Rating.create({ resourceId: r5._id, userId: student._id, rating: 5 });
      await Rating.create({ resourceId: r6._id, userId: student._id, rating: 4 });
      await Rating.create({ resourceId: r7._id, userId: student._id, rating: 5 });
      await Rating.create({ resourceId: r8._id, userId: student._id, rating: 4 });
      await Rating.create({ resourceId: r9._id, userId: student._id, rating: 5 });
      await Rating.create({ resourceId: r10._id, userId: student._id, rating: 4 });
      await Rating.create({ resourceId: r11._id, userId: student._id, rating: 5 });
      await Rating.create({ resourceId: r12._id, userId: student._id, rating: 4 });

      // Bookmarks
      await Bookmark.create({ userId: student._id, resourceId: r1._id });
      await Bookmark.create({ userId: student._id, resourceId: r3._id });
      await Bookmark.create({ userId: student._id, resourceId: r6._id });
      await Bookmark.create({ userId: student._id, resourceId: r11._id });
    }

    console.log('Seed complete.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
