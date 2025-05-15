const { MongoClient } = require('mongodb');

// Get your Atlas connection string from Compass
// Click the "Connect" button in Compass and choose "Connect using MongoDB Compass"
// It should look something like: mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/
const uri = "mongodb+srv://arinzenwaforc:Phantom_01@cluster0.phjawqa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function setupDatabase() {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log("Successfully connected to MongoDB Atlas!");
    
    const db = client.db("schoolpast");
    const waitlistCollection = db.collection("waitlist");
    
    // Create unique index on email field
    await waitlistCollection.createIndex({ email: 1 }, { unique: true });
    console.log("Created unique index on email field");
    
    // Create index on timestamp for efficient date-based queries
    await waitlistCollection.createIndex({ timestamp: 1 });
    console.log("Created index on timestamp field");
    
    // Test inserting a sample document
    const testDoc = {
      email: "test@example.com",
      timestamp: new Date()
    };
    
    await waitlistCollection.insertOne(testDoc);
    console.log("Successfully inserted test document");
    
    // Clean up test document
    await waitlistCollection.deleteOne({ email: "test@example.com" });
    console.log("Cleaned up test document");
    
    await client.close();
    console.log("Database setup completed successfully!");
  } catch (err) {
    if (err.code === 11000) {
      console.log("Indexes already exist - database is ready to use!");
    } else {
      console.error("Error setting up database:", err);
    }
  }
}

setupDatabase(); 