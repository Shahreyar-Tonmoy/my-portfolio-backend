# My Portfolio Backend API 🚀

Dedicated backend REST API service and database controller for Shahreyar Tonmoy's Portfolio.

## Tech Stack
- **Node.js** & **Express.js** (ES Modules)
- **MongoDB** & **Mongoose**
- **JWT (JSON Web Token)** Authentication & Bcrypt Password Hashing
- **Multer** for multipart uploads & **ImgBB API** integration

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/my_portfolio?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key
ADMIN_USERNAME=
ADMIN_PASSWORD=
IMGBB_API_KEY=your_imgbb_key
CLIENT_URL=
```

### 3. Seed Initial Data
```bash
npm run seed
```

### 4. Run Development Server
```bash
npm run dev
# or production mode:
npm start
```

## API Routes Overview
- `GET  /api/health` - Server & database status check
- `POST /api/auth/login` - Admin authentication
- `GET  /api/profile` - Portfolio profile & About Me data
- `PUT  /api/profile` - Update profile & About Me (Protected)
- `GET  /api/projects` - List all portfolio projects
- `POST /api/projects` - Create new project with multi-images (Protected)
- `PUT  /api/projects/:id` - Update existing project (Protected)
- `DELETE /api/projects/:id` - Delete project (Protected)
- `GET  /api/skills` - List skills
- `POST /api/skills` - Add new skill (Protected)
- `PUT  /api/skills/:id` - Update skill (Protected)
- `DELETE /api/skills/:id` - Delete skill (Protected)
- `GET  /api/education` - List education milestones
- `POST /api/education` - Add education (Protected)
- `PUT  /api/education/:id` - Update education (Protected)
- `DELETE /api/education/:id` - Delete education (Protected)
- `GET  /api/messages` - Admin messages inbox (Protected)
- `POST /api/messages` - Submit contact inquiry (Public)
- `POST /api/upload` - Direct file upload / ImgBB proxy (Protected)
- `POST /api/upload/resume` - Upload Resume/CV PDF (Protected)
