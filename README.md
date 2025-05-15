# SchoolPast.ng Landing Page

This is the landing page for SchoolPast.ng, a platform for Nigerian students to access educational resources, connect with peers, provide feedback to institutions, and discover financial aid opportunities.

## Waitlist Functionality

The landing page includes a waitlist feature that:
1. Collects user email addresses
2. Stores emails in a JSON file/ in Mongodb database
3. Sends confirmation emails to users who sign up

## Setup Instructions

### Prerequisites
- Node.js (v14 or later)
- npm (v6 or later)

### Installation

1. Clone the repository:
```
git clone <repository-url>
cd schoolpast-ng
```

2. Install dependencies:
```
npm install
```

3. Create a `.env` file:
   - Copy `env.example` to `.env`
   - Modify the settings as needed
   - For production, add your SMTP server details

```
cp env.example .env
```

### Running the App

#### Development Mode
```
npm run dev
```

#### Production Mode
```
npm start
```

The server will start on port 3000 (or the port specified in your .env file). You can access the landing page at http://localhost:3000.

## How the Waitlist Works

1. Users enter their email address in the waitlist modal
2. The client sends the email to the server via a POST request to `/api/waitlist`
3. The server validates the email and adds it to `data/waitlist.json`
4. A confirmation email is sent to the user
5. The user sees a success message in the modal

## Customization

### Waitlist Storage
By default, all emails are stored in `data/waitlist.json`. You can modify `server.js` to use a different storage method like a database.

### Email Templates
The email template is defined in `server.js`. You can modify the HTML template to change the appearance of confirmation emails.

### Email Service
The app uses Nodemailer for sending emails. In development, it creates a test account on Ethereal for previewing emails. In production, configure your SMTP settings in the `.env` file.

## Folder Structure

- `index.html` - Main landing page
- `styles.css` - Styles for the landing page
- `script.js` - Client-side JavaScript
- `server.js` - Node.js server for the waitlist API
- `data/` - Directory where waitlist data is stored
- `package.json` - Project dependencies and scripts

## License

[Your license information] 