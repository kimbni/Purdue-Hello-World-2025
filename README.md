# SyncUp - AI-Powered Hangout Planning App

SyncUp is a web application that helps students connect with each other, share their interests, and find the perfect hangout buddies. The app features user authentication, personalized profiles, schedule management, and AI-powered hangout suggestions.

## Features

- **User Authentication**: Secure login with Auth0
- **Personal Profiles**: Store interests, majors, and personal information
- **Schedule Management**: Add and manage class schedules
- **Hangout Suggestions**: AI-powered suggestions based on shared interests and availability
- **Buddy System**: Connect with other students
- **Real-time Updates**: Live updates for suggestions and buddy connections

## Tech Stack

### Frontend
- React 18 with TypeScript
- Material-UI (MUI) for components
- Context API for state management
- Axios for API calls

### Backend
- Node.js with Express
- MongoDB for database
- Auth0 for authentication
- CORS enabled for cross-origin requests

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Auth0 account

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Purdue-Hello-World-2025
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Install Backend Dependencies
```bash
cd server
npm install
```

### 4. Environment Setup

Create a `.env` file in the `server` directory with the following variables:

```env
# Server Configuration
PORT=5000
CLIENT_URL=http://localhost:3000

# MongoDB Configuration
MONGODB_URI=mongodb+srv://wukimberley98_db_user:eSERpU2flXDh3pVu@helloworldcluster.nsxxcfd.mongodb.net/?retryWrites=true&w=majority&appName=HelloWorldCluster

# Auth0 Configuration
AUTH0_SECRET=a long, randomly-generated string stored in env
AUTH0_BASE_URL=http://localhost:5000
AUTH0_CLIENT_ID=Z0BsTz8f76UtQnaFckAjHA8M9aMxBGGz
AUTH0_ISSUER_BASE_URL=https://dev-rcbo7an8pg7847wt.us.auth0.com
```

### 5. Auth0 Configuration

1. Go to your Auth0 dashboard
2. Create a new application (Single Page Application)
3. Add `http://localhost:3000` to Allowed Callback URLs
4. Add `http://localhost:3000` to Allowed Logout URLs
5. Add `http://localhost:5000` to Allowed Web Origins
6. Update the environment variables with your Auth0 credentials

### 6. Running the Application

#### Start the Backend Server
```bash
cd server
npm start
```

#### Start the Frontend (in a new terminal)
```bash
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Project Structure

```
├── src/
│   ├── components/          # React components
│   ├── contexts/           # React contexts (AuthContext)
│   ├── services/           # API services
│   ├── types/              # TypeScript type definitions
│   ├── App.tsx            # Main app component
│   └── index.tsx          # App entry point
├── server/
│   ├── server.js          # Express server
│   └── package.json       # Server dependencies
├── public/                # Static assets
└── package.json           # Frontend dependencies
```

## API Endpoints

### Authentication
- `GET /login` - Redirects to Auth0 login
- `GET /logout` - Logs out user
- `GET /callback` - Auth0 callback handler

### User Management
- `GET /api/profile` - Get current user profile
- `PUT /api/profile` - Update user profile
- `GET /api/users` - Get all users (for buddy search)

### Hangout Suggestions
- `GET /api/suggestions` - Get user's suggestions
- `POST /api/suggestions` - Create new suggestion
- `PUT /api/suggestions/:id` - Update suggestion

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  auth0Id: String,        // Auth0 user ID
  name: String,
  email: String,
  interests: [String],    // Array of interest tags
  majors: [String],       // Array of majors
  schedule: [Object],    // Array of class schedules
  buddies: [String],      // Array of buddy user IDs
  createdAt: Date,
  updatedAt: Date
}
```

### Suggestions Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  location: String,
  suggestedTime: Date,
  duration: Number,      // in minutes
  activity: String,
  participants: [String], // Array of user IDs
  status: String,        // 'pending', 'accepted', 'declined', 'completed'
  responses: Object,      // User responses
  createdBy: String,     // Creator's user ID
  createdAt: Date
}
```

## Development

### Adding New Features
1. Create components in `src/components/`
2. Add API endpoints in `server/server.js`
3. Update types in `src/types/index.ts`
4. Add API methods in `src/services/api.ts`

### Authentication Flow
1. User clicks "Sign In" → redirects to Auth0
2. Auth0 handles authentication → redirects back to backend
3. Backend creates/updates user in MongoDB
4. Frontend checks authentication status via API
5. User data is loaded and displayed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
