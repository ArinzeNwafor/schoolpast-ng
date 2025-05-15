# SchoolPast.ng Waitlist Installation Guide

This guide will help you set up the SchoolPast.ng landing page with the waitlist functionality.

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

## Installation Steps

1. **Clone or download the repository**

   If you received this as a zip file, extract it to a folder of your choice.

2. **Install dependencies**

   Open a terminal/command prompt in the project folder and run:

   ```
   npm install
   ```

   This will install all the required dependencies.

3. **Configure the environment**

   Copy the `env.example` file and rename it to `.env`:

   ```
   cp env.example .env   # For Mac/Linux
   copy env.example .env # For Windows
   ```

   Edit the `.env` file to configure your settings:

   - `PORT`: The port your server will run on (default: 3000)
   - For production, uncomment and fill in the SMTP settings for sending emails

4. **Start the server**

   For development with auto-restart:
   ```
   npm run dev
   ```

   For production:
   ```
   npm start
   ```

5. **Access the website**

   Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

   (Replace 3000 with the port you set in your .env file if different)

## Waitlist Features

- **User Waitlist**: Users can join the waitlist by entering their email on the modal form
- **Email Confirmation**: Users receive a confirmation email when they join the waitlist
- **Data Storage**: Email addresses are stored in `data/waitlist.json`
- **Admin Panel**: Access the admin panel at `http://localhost:3000/admin.html`
  - Default password: `schoolpast2023` (Change this in admin.html for security in production)

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production` in your environment
2. Configure real SMTP settings in the `.env` file
3. Use a process manager like PM2 to keep the server running:
   ```
   npm install -g pm2
   pm2 start server.js --name schoolpast
   ```

## Troubleshooting

- **Email sending fails**: Verify your SMTP settings in the `.env` file
- **"Address already in use" error**: Change the port in the `.env` file
- **Data not saving**: Ensure the `data` directory has write permissions

## Security Notes

This is a demonstration application. In a production environment, you should:

1. Use proper authentication for the admin panel
2. Set up HTTPS
3. Store emails in a database instead of a JSON file
4. Implement rate limiting
5. Add CSRF protection 