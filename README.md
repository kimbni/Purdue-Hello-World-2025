# SyncUp - AI-Powered Hangout Planning App

SyncUp is a web application that helps students connect with each other, share their interests, and find the perfect hangout buddies. The app features user authentication, personalized profiles, schedule management, and **AI-powered hangout suggestions powered by Google's Gemini AI**.

## Features

- **User Authentication**: Secure login with Auth0
- **Personal Profiles**: Store interests, majors, and personal information
- **Schedule Management**: Add and manage class schedules
- **🤖 AI-Powered Hangout Suggestions**: Personalized activity recommendations using Google Gemini AI that align with user majors and interests
- **Buddy System**: Connect with other students
- **Real-time Updates**: Live updates for suggestions and buddy connections

## Tech Stack

### Frontend
- React 18 with TypeScript
- Material-UI (MUI) for components
- Context API for state management
- Axios for API calls
- **Google Gemini AI** for intelligent activity suggestions

### Backend
- Node.js with Express
- MongoDB for database
- Auth0 for authentication
- CORS enabled for cross-origin requests

### AI Integration
- **Google Gemini AI** (`@google/genai` package)
- Personalized prompt engineering for major and interest alignment
- Fallback system for robust error handling

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Auth0 account
- **Google Gemini AI API key** (get from [Google AI Studio](https://ai.google.dev/))

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

Create a `.env` file in the root directory with the following variables:

```env
# Gemini AI Configuration
REACT_APP_GEMINI_API_KEY=your-gemini-api-key-here
```

Create a `.env` file in the `server` directory with the following variables:

```env
# Server Configuration
PORT=5000
CLIENT_URL=http://localhost:3000

# MongoDB Configuration
MONGODB_URI=your-mongodb-connection-string-here

# Auth0 Configuration
AUTH0_SECRET=a long, randomly-generated string stored in env
AUTH0_BASE_URL=http://localhost:5000
AUTH0_CLIENT_ID=Z0BsTz8f76UtQnaFckAjHA8M9aMxBGGz
AUTH0_ISSUER_BASE_URL=https://dev-rcbo7an8pg7847wt.us.auth0.com
```

### 5. Gemini AI Configuration

1. Go to [Google AI Studio](https://ai.google.dev/)
2. Sign in with your Google account
3. Click "Get API Key" and create a new API key
4. Copy the API key and add it to your `.env` file as `REACT_APP_GEMINI_API_KEY`

### 6. Auth0 Configuration

1. Go to your Auth0 dashboard
2. Create a new application (Single Page Application)
3. Add `http://localhost:3000` to Allowed Callback URLs
4. Add `http://localhost:3000` to Allowed Logout URLs
5. Add `http://localhost:5000` to Allowed Web Origins
6. Update the environment variables with your Auth0 credentials

### 7. Running the Application

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

## 🤖 AI Features

### Gemini-Powered Hangout Suggestions

SyncUp uses Google's Gemini AI to generate personalized hangout activity suggestions that are perfectly aligned with each user's:

- **Academic Majors**: CS students get tech-focused activities, engineering students get hands-on projects, etc.
- **Personal Interests**: Gaming enthusiasts get game development activities, music lovers get jam sessions, etc.
- **Group Dynamics**: Activities are tailored to the number of buddies participating
- **Purdue Context**: All suggestions are feasible for Purdue University students in West Lafayette

#### How It Works

1. **User Profile Analysis**: The AI analyzes the user's majors, interests, and buddy count
2. **Personalized Prompting**: Creates targeted prompts based on academic field and interests
3. **Smart Suggestions**: Generates activities like "Game Jam at Purdue Makerspace" for CS students interested in gaming
4. **Fallback System**: Provides relevant alternatives if the AI service is unavailable

#### Example Suggestions

- **Computer Science + Technology + Gaming**: "Game Jam at Purdue Makerspace" - collaborative game development
- **Engineering + Sports**: "Engineering Sports Competition" - building and testing sports equipment
- **Business + Music**: "Startup Music Event Planning" - organizing campus music events
- **Biology + Outdoor**: "Campus Nature Research Walk" - studying local flora and fauna

## Project Structure

```
├── src/
│   ├── components/          # React components
│   │   ├── HangoutSuggestions.tsx  # AI-powered suggestions component
│   │   ├── Dashboard.tsx           # Main dashboard
│   │   └── ...                    # Other components
│   ├── contexts/           # React contexts (AuthContext)
│   ├── services/           # API services
│   │   ├── api.ts         # REST API service
│   │   └── geminiService.ts # Gemini AI service
│   ├── types/              # TypeScript type definitions
│   ├── App.tsx            # Main app component
│   └── index.tsx          # App entry point
├── server/
│   ├── server.js          # Express server
│   └── package.json       # Server dependencies
├── public/                # Static assets
├── .env                   # Gemini AI API key
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

### AI Integration Details

The Gemini AI integration is implemented in `src/services/geminiService.ts`:

- **Personalized Prompting**: Creates targeted prompts based on user majors and interests
- **Major-Specific Guidance**: Provides specific activity suggestions for different academic fields
- **Interest-Specific Guidance**: Tailors activities to personal interests
- **Error Handling**: Robust fallback system with user-specific alternatives
- **Type Safety**: Full TypeScript support with proper error handling

#### Key Methods:
- `generateActivitySuggestions()`: Main method that calls Gemini AI
- `getMajorSpecificGuidance()`: Creates prompts for academic fields
- `getInterestSpecificGuidance()`: Creates prompts for personal interests
- `getFallbackSuggestion()`: Provides relevant alternatives when AI fails

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
