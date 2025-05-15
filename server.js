const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const path = require('path');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const SibApiV3Sdk = require('sib-api-v3-sdk');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://arinzenwaforc:Phantom_01@cluster0.phjawqa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const DB_NAME = process.env.DB_NAME || 'schoolpast';
const COLLECTION_NAME = 'waitlist';

// MongoDB Client
let db;
let waitlistCollection;

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('Connected to MongoDB successfully');
    
    db = client.db(DB_NAME);
    waitlistCollection = db.collection(COLLECTION_NAME);
    
    // Create index on email for faster lookups and unique constraint
    await waitlistCollection.createIndex({ email: 1 }, { unique: true });
    
    return client;
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    throw err;
  }
}

// Initialize MongoDB connection
connectToMongoDB()
  .then(() => console.log('MongoDB setup complete'))
  .catch(err => {
    console.error('MongoDB setup failed:', err);
    process.exit(1); // Exit if we can't connect to MongoDB
  });

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // Serve static files

// Configure Brevo API client
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

// Create API instance for sending emails
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// For development - set to true during development, false in production
const DEV_MODE = true;

// Rate limiting configuration
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Apply rate limiting to waitlist submissions
app.use('/api/waitlist', apiLimiter);

// API route to handle waitlist submissions
app.post('/api/waitlist', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }
    
    // Check if email already exists in MongoDB
    const existingEntry = await waitlistCollection.findOne({ email: email });
    if (existingEntry) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already registered on waitlist'
      });
    }
    
    // Add to waitlist with timestamp
    const newEntry = {
      email,
      timestamp: new Date(),
      source: req.headers.referer || 'direct'
    };
    
    // Insert into MongoDB
    await waitlistCollection.insertOne(newEntry);
    
    // Send confirmation email using Brevo
    try {
      // Build the HTML content
      const htmlContent = `
        <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <img src="https://schoolpast.ng/schoolpastlogo.png" alt="SchoolPast.ng Logo" style="max-width: 150px; display: block; margin: 0 auto 20px;">
          <h1 style="color: #0a7c2e; text-align: center; margin-bottom: 20px;">You're on the waitlist!</h1>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Thank you for joining the SchoolPast.ng waitlist! We're excited to have you on board.
          </p>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            SchoolPast.ng is the upcoming voice and hub for Nigerian students. You'll be among the first to access:
          </p>
          <ul style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            <li>Educational resources and past questions</li>
            <li>Student community networking</li>
            <li>Scholarship opportunities</li>
            <li>Institutional feedback channels</li>
          </ul>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            We'll notify you as soon as the platform launches. Stay tuned!
          </p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <p style="font-size: 14px; margin: 0; text-align: center; color: #555;">
              If you didn't sign up for the SchoolPast.ng waitlist, please ignore this email.
            </p>
          </div>
          <p style="font-size: 14px; text-align: center; color: #777; margin-top: 40px;">
            © ${new Date().getFullYear()} SchoolPast.ng. All rights reserved.
          </p>
        </div>
      `;
      
      // Create a send email request
      const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
      
      sendSmtpEmail.subject = "🎉 You're IN! Your Journey with SchoolPast.ng Begins Now!";
      sendSmtpEmail.htmlContent = htmlContent;
      sendSmtpEmail.sender = { 
        name: "Arinze from SchoolPast.ng", 
        email: process.env.SENDER_EMAIL || "noreply@schoolpast.ng" 
      };
      sendSmtpEmail.to = [{ email: email }];
      sendSmtpEmail.replyTo = { 
        email: process.env.REPLY_TO_EMAIL || "support@schoolpast.ng", 
        name: "SchoolPast.ng Support"
      };
      
      // Send the email
      const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log('Confirmation email sent via Brevo. MessageId:', result.messageId);
      
    } catch (error) {
      console.error('Failed to send confirmation email:', error);
      // We still consider the operation successful even if email fails
    }
    
    return res.status(200).json({ 
      success: true, 
      message: 'Successfully added to waitlist'
    });
    
  } catch (error) {
    console.error('Waitlist submission error:', error);
    
    // Check if this is a duplicate key error (MongoDB error code 11000)
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already registered on waitlist'
      });
    }
    
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error'
    });
  }
});

// API route to get all waitlist entries (for admin panel)
app.get('/api/waitlist', async (req, res) => {
  try {
    // In a real application, we would add authentication here
    // This is a simplified example for demonstration purposes
    
    // Check for a simple API key
    const apiKey = req.headers['x-api-key'] || req.query.apiKey;
    const adminKey = process.env.ADMIN_API_KEY || 'schoolpast-admin-key';
    
    // Simple validation - in production, use proper authentication
    if (DEV_MODE !== true && apiKey !== adminKey) {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized access'
      });
    }
    
    // Get data from MongoDB
    const waitlistEntries = await waitlistCollection.find({}).toArray();
    
    return res.status(200).json(waitlistEntries);
    
  } catch (error) {
    console.error('Error retrieving waitlist data:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error'
    });
  }
});

// API route to get waitlist statistics
app.get('/api/waitlist/stats', async (req, res) => {
  try {
    // Check for a simple API key
    const apiKey = req.headers['x-api-key'] || req.query.apiKey;
    const adminKey = process.env.ADMIN_API_KEY || 'schoolpast-admin-key';
    
    // Simple validation - in production, use proper authentication
    if (DEV_MODE !== true && apiKey !== adminKey) {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized access'
      });
    }
    
    // Calculate date thresholds
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    // Get total count
    const totalCount = await waitlistCollection.countDocuments({});
    
    // Get counts for different time periods
    const last24Hours = await waitlistCollection.countDocuments({ timestamp: { $gte: oneDayAgo } });
    const last7Days = await waitlistCollection.countDocuments({ timestamp: { $gte: sevenDaysAgo } });
    const last30Days = await waitlistCollection.countDocuments({ timestamp: { $gte: thirtyDaysAgo } });
    
    return res.status(200).json({
      success: true,
      stats: {
        total: totalCount,
        last24Hours,
        last7Days,
        last30Days
      }
    });
    
  } catch (error) {
    console.error('Error retrieving waitlist statistics:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error'
    });
  }
});

// API route to export waitlist to CSV
app.get('/api/waitlist/export', async (req, res) => {
  try {
    // Check for API key
    const apiKey = req.headers['x-api-key'] || req.query.apiKey;
    const adminKey = process.env.ADMIN_API_KEY || 'schoolpast-admin-key';
    
    if (DEV_MODE !== true && apiKey !== adminKey) {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized access'
      });
    }
    
    // Get all waitlist entries
    const entries = await waitlistCollection.find({}).toArray();
    
    // Create CSV content
    let csvContent = 'Email,Date Joined,Source\n';
    
    entries.forEach(entry => {
      const formattedDate = new Date(entry.timestamp).toLocaleString();
      const source = entry.source || 'unknown';
      csvContent += `"${entry.email}","${formattedDate}","${source}"\n`;
    });
    
    // Set headers for CSV download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=schoolpast-waitlist-${new Date().toISOString().split('T')[0]}.csv`);
    
    // Send CSV content
    return res.status(200).send(csvContent);
    
  } catch (error) {
    console.error('Error exporting waitlist:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error'
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser`);
  console.log(`Mode: ${DEV_MODE ? 'Development' : 'Production'}`);
}); 