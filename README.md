# Mini LinkedIn Community Platform

A full-stack social media platform built with Next.js, Node.js, Express, and MongoDB, featuring user authentication, posts, likes and comments.

## 🚀 Features

### Core Features
- **User Authentication**: Register, login, and secure session management
- **Profile Management**: User profiles with bio .
- **Public Post Feed**: Create, read, and display posts with timestamps
- **Profile Pages**: View user profiles and their posts

### Enhanced Features
- **Post Interactions**: Like and unlike posts
- **Comment System**: Add and delete comments on posts
- **Post Management**: Delete posts (author only)
- **Real-time Updates**: Dynamic UI updates for likes, comments, and posts

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd mini-linkedin
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Create environment file**
   ```bash
   # Create .env file in server directory
   MONGODB_URI=mongo_local_url or atlas cluster url 
   JWT_SECRET=your-secret-key-here
   PORT=5000
   ```

4. **Create uploads directory**
   ```bash
   mkdir uploads
   ```

5. **Start the server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Install client dependencies**
   ```bash
   cd client
   npm install
   ```

2. **Create environment file**
   ```bash
   # Create .env.local file in client directory
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

## 🎯 Usage

### Demo Accounts
You can create your own account or use these demo credentials:
- **Email**: xyz@gmail.com
- **Password**: xyz123

### Features Guide

1. **Registration/Login**
   - Navigate to `/register` or `/login`
   - Create an account with name, email, password, and bio

2. **Creating Posts**
   - On the home page, use the text area to create posts
   - Posts are displayed in chronological order

3. **Interacting with Posts**
   - **Like/Unlike**: Click the heart icon to like or unlike posts
   - **Comment**: Click the comment icon to expand comments section
   - **Delete**: Click the delete button (only visible to post author)

4. **Profile Management**
   - Visit your profile page .
   - View your posts and profile information
   - Edit bio 

5. **Viewing Other Profiles**
   - Click on user names to view their profiles
   - See their posts and profile information

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create a post
- `POST /api/posts/:id/like` - Like/unlike a post
- `DELETE /api/posts/:id` - Delete a post
- `GET /api/posts/user/:userId` - Get user's posts

### Comments
- `GET /api/comments/post/:postId` - Get post comments
- `POST /api/comments` - Create a comment
- `DELETE /api/comments/:id` - Delete a comment

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile


## 🚀 Deployment

### Backend Deployment (Render)
1. Connect your GitHub repository to Render
2. Set environment variables in Render dashboard
3. Deploy the server directory

### Frontend Deployment (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy the client directory

## 📁 Project Structure

```
mini-linkedin/
├── client/                 # Next.js frontend
│   ├── src/
│   │   ├── app/           # App router pages
│   │   ├── components/    # React components
│   │   └── utils/         # Utility functions
│   └── package.json
├── server/                 # Express backend
│   ├── src/
│   │   ├── config/        # Database configuration
│   │   ├── middleware/    # Custom middleware
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   └── uploads/       # Uploaded files
│   └── package.json
└── README.md
```

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- File upload validation and size limits
- Authorization checks for post/comment deletion
- CORS configuration for cross-origin requests

## 🎨 UI/UX Features

- Responsive design with Tailwind CSS
- Modern, clean interface
- Real-time updates for interactions
- Loading states and error handling
- Profile photo display with fallback avatars

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🐛 Known Issues

- Profile photo upload requires server restart to create uploads directory
- TypeScript types for js-cookie need to be installed manually

## 🔮 Future Enhancements

- Real-time notifications
- Follow/unfollow users
- Post sharing
- Advanced search functionality
- Mobile app development
- Real-time chat
- Post categories and tags 
