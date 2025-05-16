const sgMail = require('@sendgrid/mail');
const fs = require('fs');
const path = require('path');

// Initialize SendGrid with API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Path to the waitlist data file
const WAITLIST_FILE = path.join(process.cwd(), 'data', 'waitlist.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
  fs.mkdirSync(path.join(process.cwd(), 'data'));
}

// Initialize waitlist file if it doesn't exist
if (!fs.existsSync(WAITLIST_FILE)) {
  fs.writeFileSync(WAITLIST_FILE, JSON.stringify({ emails: [] }));
}

// Helper function to read waitlist data
function readWaitlistData() {
  try {
    const data = fs.readFileSync(WAITLIST_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading waitlist data:', error);
    return { emails: [] };
  }
}

// Helper function to write waitlist data
function writeWaitlistData(data) {
  try {
    fs.writeFileSync(WAITLIST_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing waitlist data:', error);
    return false;
  }
}

export default async function handler(req, res) {
  // Handle GET request for exporting waitlist data
  if (req.method === 'GET') {
    // Check for admin authentication
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_API_KEY}`) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const data = readWaitlistData();
    
    // Convert to CSV format
    const csvContent = ['email,date_added\n'];
    data.emails.forEach(entry => {
      csvContent.push(`${entry.email},${entry.date}\n`);
    });

    // Set headers for CSV download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=waitlist.csv');
    
    return res.status(200).send(csvContent.join(''));
  }

  // Handle POST request for adding to waitlist
  if (req.method === 'POST') {
    try {
      const { email } = req.body;

      // Validate email
      if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required' });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email format' });
      }

      // Read current waitlist data
      const data = readWaitlistData();
      
      // Check if email already exists
      if (data.emails.some(entry => entry.email === email)) {
        return res.status(200).json({ 
          success: true, 
          message: 'You are already on our waitlist'
        });
      }

      // Add new email with timestamp
      data.emails.push({
        email,
        date: new Date().toISOString()
      });

      // Save updated data
      if (!writeWaitlistData(data)) {
        throw new Error('Failed to save waitlist data');
      }

      // Send welcome email using SendGrid
      const msg = {
        to: email,
        from: {
          email: process.env.SENDER_EMAIL || 'noreply@schoolpast.ng',
          name: 'Arinze from Schoolpast.ng'
        },
        subject: "🎉 You're IN! Your Journey with SchoolPast.ng Begins Now!",
        html: `
          <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <img src="https://schoolpast-ng.vercel.app/schoolpastlogo.png" alt="SchoolPast.ng Logo" style="max-width: 150px; display: block; margin: 0 auto 20px;">
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
              © ${new Date().getFullYear()} SchoolPast.ng
            </p>
          </div>
        `
      };

      await sgMail.send(msg);

      return res.status(200).json({ 
        success: true, 
        message: 'Successfully added to waitlist'
      });

    } catch (error) {
      console.error('Waitlist submission error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Internal server error'
      });
    }
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
} 