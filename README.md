# 📚 E-Library with Notes Sharing

A modern, full-stack web application for students and teachers to upload, share, and discover educational resources. Built with the MERN stack featuring a beautiful, library-themed UI with notebook-style commenting.

## ✨ Features

### 🔐 Authentication & User Management
- **JWT-based authentication** with secure password hashing
- **Role-based access control**: Student, Teacher, Admin
- **User registration and login** with email validation
- **Protected routes** based on user roles

### 📖 Resource Management
- **File upload system** supporting PDF, DOC, DOCX, PPT, PPTX
- **Drag & drop interface** with file validation
- **Resource metadata**: Title, subject, description, tags
- **Status management**: Pending, Approved, Rejected
- **Download tracking** and analytics

### 🔍 Discovery & Search
- **Advanced filtering** by subject, status, and tags
- **Real-time search** across titles, descriptions, and content
- **Sorting options**: Date, title, downloads, ratings
- **Responsive grid layout** with beautiful cards

### 💬 Social Features
- **Rating system** (1-5 stars) with user feedback
- **Commenting system** with notebook-style interface
- **Bookmarking** for personal resource collections
- **Community engagement** through shared notes

### 📊 Admin Panel
- **Resource approval workflow** for quality control
- **User management** with blocking/unblocking
- **System analytics** and usage statistics
- **Content moderation** tools

### 🎨 Beautiful UI/UX
- **Library-themed design** with bookshelf aesthetics
- **Notebook-style commenting** interface
- **Responsive design** for all devices
- **Smooth animations** and transitions
- **Tailwind CSS** for modern styling

## 🚀 Tech Stack

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Multer** for file uploads
- **Bcrypt** for password hashing
- **Helmet, CORS, Compression** for security & performance

### Frontend
- **React 19** with modern hooks
- **Vite** for fast development
- **React Router** for navigation
- **Zustand** for state management
- **Tailwind CSS** for styling
- **Axios** for API communication

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB 6+
- npm or yarn package manager

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd e-library-and-notes-sharing
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file:
```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/e_library
JWT_SECRET=supersecretjwtkeychange
JWT_EXPIRES_IN=7d
```

### 3. Frontend Setup
```bash
cd ../client
npm install
```

### 4. Database Setup
```bash
cd ../server
npm run seed
```

### 5. Start the Application
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend  
cd client
npm run dev
```

## 🌐 Access URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Database**: MongoDB on localhost:27017

## 👥 Demo Credentials

### Admin User
- **Email**: admin@elibrary.com
- **Password**: admin123
- **Role**: Admin (Full access to all features)

### Teacher User  
- **Email**: teacher@elibrary.com
- **Password**: teacher123
- **Role**: Teacher (Upload, manage resources, all student features)

### Student User
- **Email**: student@elibrary.com  
- **Password**: student123
- **Role**: Student (Browse, download, comment, rate, bookmark)

## 📱 User Guide

### For Students
1. **Browse Library**: Search and filter resources by subject, tags, or keywords
2. **Download Resources**: Access approved educational materials
3. **Rate & Comment**: Share feedback and notes with the community
4. **Build Your Shelf**: Bookmark resources for later access
5. **Track Progress**: View your activity and contributions

### For Teachers
1. **Upload Resources**: Share your knowledge with drag & drop interface
2. **Manage Content**: Organize materials with tags and descriptions
3. **Monitor Engagement**: Track downloads and student feedback
4. **Curate Collections**: Create reading lists and assignments

### For Admins
1. **Content Moderation**: Approve/reject uploaded resources
2. **User Management**: Monitor and manage user accounts
3. **System Analytics**: View usage statistics and trends
4. **Quality Control**: Ensure content meets standards

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/auth/me` - Get current user

### Resources
- `GET /api/resources` - List all resources
- `GET /api/resources/:id` - Get specific resource
- `POST /api/resources` - Upload new resource
- `POST /api/resources/:id/download` - Download resource
- `DELETE /api/resources/:id` - Delete resource

### Comments & Ratings
- `GET /api/comments?resourceId=:id` - Get resource comments
- `POST /api/comments` - Add comment
- `POST /api/ratings` - Rate resource

### Bookmarks
- `GET /api/bookmarks` - Get user bookmarks
- `POST /api/bookmarks` - Add bookmark
- `DELETE /api/bookmarks` - Remove bookmark

### Admin
- `GET /api/admin/pending` - Get pending resources
- `POST /api/admin/approve/:id` - Approve resource
- `POST /api/admin/reject/:id` - Reject resource
- `GET /api/admin/users` - Get all users
- `POST /api/admin/block/:id` - Block user
- `GET /api/admin/stats` - Get system statistics

## 🎯 Key Features Demo

### 1. **Complete Authentication Flow**
- Register as new user (Student/Teacher)
- Login with existing credentials
- Role-based navigation and access control

### 2. **Resource Upload & Management**
- Drag & drop file uploads
- Metadata entry and validation
- Admin approval workflow
- Status tracking and updates

### 3. **Advanced Search & Discovery**
- Real-time search across all content
- Filter by subject, status, tags
- Sort by various criteria
- Responsive grid layout

### 4. **Social Learning Features**
- Star ratings with visual feedback
- Notebook-style commenting
- Personal bookmark collections
- Community engagement tracking

### 5. **Admin Control Panel**
- Resource approval interface
- User management dashboard
- System analytics and insights
- Content moderation tools

## 🎨 Design Philosophy

The application combines **digital library aesthetics** with **personal notebook functionality**:

- **Library Theme**: Bookshelf layouts, card-based resources, academic color palette
- **Notebook Interface**: Comment sections styled like personal notes, paper textures
- **Student-Friendly**: Clean, minimal design optimized for learning environments
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices

## 🔒 Security Features

- **JWT Authentication** with secure token storage
- **Password Hashing** using bcrypt
- **Role-based Access Control** for all endpoints
- **Input Validation** and sanitization
- **CORS Protection** and security headers
- **File Upload Validation** and size limits

## 📊 Performance Features

- **MongoDB Indexing** for fast queries
- **Efficient Pagination** for large datasets
- **Image Optimization** and compression
- **Lazy Loading** for better user experience
- **Caching Strategies** for frequently accessed data

## 🚀 Deployment

### Environment Variables
```env
NODE_ENV=production
PORT=3000
MONGO_URI=mongodb://your-mongodb-uri
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
```

### Build Commands
```bash
# Frontend
cd client
npm run build

# Backend
cd server
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the demo credentials above

---

**Built with ❤️ for the educational community**
