# TaskTracker - Project Management Application

TaskTracker is a comprehensive project and task management application that allows users to track progress on multiple projects. Built with React.js, Express.js, and MongoDB/PostgreSQL, this application provides a robust solution for project management with secure user authentication.

![TaskTracker Logo](./frontend/src/assets/logo.png)

## Features

- **User Authentication**: Secure signup and login with JWT token-based authentication
- **Project Management**: Create and manage up to 4 projects per user
- **Task Management**: Full CRUD operations for tasks with status tracking
- **User Profiles**: Manage user information including name, email, and country
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## Tech Stack

### Frontend
- React.js (with Vite)
- Tailwind CSS for styling
- React Router for navigation
- Axios for API requests
- Context API for state management

### Backend
- Express.js
- MongoDB/PostgreSQL (configurable)
- JSON Web Token (JWT) for authentication
- Bcrypt for password hashing
- Express Validator for input validation

## Project Structure

### Frontend
```
task-tracker-frontend/
├── public/               # Static assets
├── src/
│   ├── assets/           # Images, icons
│   ├── components/       # Reusable components
│   │   ├── Auth/         # Authentication components
│   │   ├── Dashboard/    # Dashboard components
│   │   ├── Layout/       # Layout components
│   │   ├── Projects/     # Project-related components
│   │   ├── Tasks/        # Task-related components
│   │   └── common/       # Common UI components
│   ├── context/          # React context providers
│   ├── services/         # API service modules
│   ├── utils/            # Utility functions
│   ├── App.jsx           # Main application component
│   └── main.jsx          # Application entry point
├── .env.example          # Environment variables example
├── package.json          # Dependencies
├── tailwind.config.js    # Tailwind CSS configuration
└── vite.config.js        # Vite configuration
```

### Backend
```
task-tracker-backend/
├── config/
│   ├── db.js           # Database connection
│   └── default.js      # Configuration variables
├── controllers/
│   ├── authController.js     # Authentication logic
│   ├── projectController.js  # Project management
│   └── taskController.js     # Task management
├── middleware/
│   ├── auth.js         # JWT authentication middleware
│   └── validation.js   # Input validation
├── models/
│   ├── User.js         # User schema
│   ├── Project.js      # Project schema
│   └── Task.js         # Task schema
├── routes/
│   ├── auth.js         # Authentication routes
│   ├── projects.js     # Project routes
│   └── tasks.js        # Task routes
├── utils/
│   └── errorHandler.js # Error handling utilities
├── .env.example        # Environment variables example
├── package.json        # Dependencies
└── server.js           # Entry point
```

## Installation and Setup

### Prerequisites
- Node.js (v14.x or higher)
- npm or yarn
- MongoDB or PostgreSQL database

### Backend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/task-tracker.git
   cd task-tracker/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the values in `.env` file:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   # OR for PostgreSQL
   # DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

4. Start the backend server:
   ```bash
   npm run dev  # For development
   # OR
   npm start    # For production
   ```

The backend server will start on http://localhost:5000 (or your configured PORT).

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../task-tracker-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the values in `.env` file:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

The frontend development server will start on http://localhost:5173 by default.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT token
- `GET /api/auth/me` - Get current user information

### Projects
- `GET /api/projects` - Get all projects for the logged-in user
- `GET /api/projects/:id` - Get a specific project
- `POST /api/projects` - Create a new project
- `PUT /api/projects/:id` - Update a project
- `DELETE /api/projects/:id` - Delete a project

### Tasks
- `GET /api/projects/:projectId/tasks` - Get all tasks for a project
- `GET /api/tasks/:id` - Get a specific task
- `POST /api/projects/:projectId/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Deployment

### Backend Deployment
The backend can be deployed to platforms like Heroku, Render, or Railway.

Example for Heroku:
```bash
heroku create
git push heroku main
```

### Frontend Deployment
The frontend can be deployed to platforms like Netlify, Vercel, or GitHub Pages.

Example for Vercel:
```bash
npm run build
vercel --prod
```

## Database Schema

### User
```
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  country: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Project
```
{
  _id: ObjectId,
  title: String,
  description: String,
  user: ObjectId (reference to User),
  createdAt: Date,
  updatedAt: Date
}
```

### Task
```
{
  _id: ObjectId,
  title: String,
  description: String,
  status: String (enum: ["todo", "in-progress", "completed"]),
  project: ObjectId (reference to Project),
  createdAt: Date,
  completedAt: Date,
  updatedAt: Date
}
```

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Contact
- GitHub: [Your GitHub Profile](https://github.com/yourusername)
- Email: your.email@example.com