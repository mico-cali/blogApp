# Threadify Blog App

A simple and user-friendly blog application that allows users to create blog posts, comment on posts, and interact with other users' content. The app features user authentication, comment moderation, and admin functionalities.

## Features

- **User Authentication**: Sign up, log in, and log out functionality for users.
- **Create and Manage Posts**: Users can create, edit, and delete their own blog posts.
- **Comment System**: Comment on blog posts and interact with other users' content.
- **Role-Based Permissions**:
  - Users can edit or delete their own comments.
  - Admins can manage all comments (delete inappropriate content).
- **Responsive Design**: Accessible on mobile, tablet, and desktop devices.

## Live Demo

Check out the live application here: [Blog App](https://blog-app-liard-ten.vercel.app/)

## Example User Account

Use the following credentials to explore the application:

**User Account:**
- Email: `test@mail.com`
- Password: `password123`

**Admin Account:**
- Email: `admin@mail.com`
- Password: `password123`

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose for object modeling)
- **Hosting**: Vercel

## Getting Started

Follow these steps to run the application locally:

### Prerequisites

Ensure you have the following installed:
- Node.js (v14 or higher)
- MongoDB

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/blog-app.git
   ```

2. Navigate to the project directory:
   ```bash
   cd blog-app
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```env
   MONGO_URI=<your_mongodb_connection_string>
   JWT_SECRET=<your_jwt_secret>
   ```

5. Start the development server:
   ```bash
   npm start
   ```

6. Access the application in your browser at `http://localhost:3000`
