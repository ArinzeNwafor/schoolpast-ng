const sgMail = require('@sendgrid/mail');
const { google } = require('googleapis');

// Initialize SendGrid with API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Initialize Google Sheets
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const SHEET_NAME = 'Waitlist';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

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

    // Get existing emails from Google Sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:A`,
    });

    const existingEmails = response.data.values ? response.data.values.flat() : [];
    
    // Check if email already exists
    if (existingEmails.includes(email)) {
      return res.status(200).json({ 
        success: true, 
        message: 'You are already on our waitlist'
      });
    }

    // Add new email to Google Sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:A`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[email, new Date().toISOString()]],
      },
    });

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
            © ${new Date().getFullYear()} SchoolPast.ng. All rights reserved.
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