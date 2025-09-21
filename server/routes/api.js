const express = require('express');
const { requiresAuth } = require('express-openid-connect');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const router = express.Router();

// MongoDB connection
const uri = process.env.MONGODB_URI || "mongodb+srv://wukimberley98_db_user:eSERpU2flXDh3pVu@helloworldcluster.nsxxcfd.mongodb.net/?retryWrites=true&w=majority&appName=HelloWorldCluster";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Initialize database connection
let db;
(async () => {
  try {
    await client.connect();
    console.log("Successfully connected to MongoDB!");
    db = client.db("syncup");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
})();

// Protected route to get user profile
router.get('/profile', requiresAuth(), async (req, res) => {
  try {
    const users = db.collection('users');
    const user = await users.findOne({ auth0Id: req.oidc.user.sub });
    
    if (!user) {
      // Create new user if doesn't exist
      const newUser = {
        auth0Id: req.oidc.user.sub,
        name: req.oidc.user.name,
        email: req.oidc.user.email,
        interests: [],
        majors: [],
        schedule: [],
        buddies: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const result = await users.insertOne(newUser);
      return res.json({ ...newUser, id: result.insertedId });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/profile', requiresAuth(), async (req, res) => {
  try {
    const users = db.collection('users');
    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };
    
    const result = await users.findOneAndUpdate(
      { auth0Id: req.oidc.user.sub },
      { $set: updateData },
      { returnDocument: 'after' }
    );
    
    if (!result.value) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.value);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all users (for buddy search)
router.get('/users', requiresAuth(), async (req, res) => {
  try {
    const users = db.collection('users');
    const allUsers = await users.find({}, { 
      projection: { 
        auth0Id: 1, 
        name: 1, 
        email: 1, 
        interests: 1, 
        majors: 1 
      } 
    }).toArray();
    
    res.json(allUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get hangout suggestions
router.get('/suggestions', requiresAuth(), async (req, res) => {
  try {
    const suggestions = db.collection('suggestions');
    const userSuggestions = await suggestions.find({
      $or: [
        { createdBy: req.oidc.user.sub },
        { participants: req.oidc.user.sub }
      ]
    }).toArray();
    
    res.json(userSuggestions);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create hangout suggestion
router.post('/suggestions', requiresAuth(), async (req, res) => {
  try {
    const suggestions = db.collection('suggestions');
    const newSuggestion = {
      ...req.body,
      createdBy: req.oidc.user.sub,
      createdAt: new Date(),
      status: 'pending',
      responses: {}
    };
    
    const result = await suggestions.insertOne(newSuggestion);
    res.json({ ...newSuggestion, id: result.insertedId });
  } catch (error) {
    console.error('Error creating suggestion:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update hangout suggestion
router.put('/suggestions/:id', requiresAuth(), async (req, res) => {
  try {
    const suggestions = db.collection('suggestions');
    const { id } = req.params;
    
    const result = await suggestions.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: req.body },
      { returnDocument: 'after' }
    );
    
    if (!result.value) {
      return res.status(404).json({ error: 'Suggestion not found' });
    }
    
    res.json(result.value);
  } catch (error) {
    console.error('Error updating suggestion:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
