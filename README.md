# Todo App

A premium, modern Todo application built with React, Redux Toolkit, Express, and MongoDB.

## Project Structure

- `/client`: React frontend with Vite, Redux Toolkit, and Tailwind CSS.
- `/server`: Express backend with Node.js, Mongoose, and TypeScript.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (Local or Atlas)

### 1. Server Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file from `.env.example`:
     ```bash
     cp .env.example .env
     ```
   - Update `.env` with your MongoDB connection string and preferred port.
4. Start the development server:
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:3000` (by default).

### 2. Client Setup

1. Navigate to the client directory:
   ```bash
   cd ../client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173` (by default).

## Features

- **Premium Design**: Modern glassmorphism UI with vibrant gradients.
- **Task Management**: Create, update status, and delete tasks.
- **Custom Modals**: Elegant confirmation dialogs for critical actions.
- **Performance**: Optimized Redux state management for smooth updates.
- **Responsiveness**: Fully functional on mobile and desktop devices.

## Tech Stack

- **Frontend**: React 19, Redux Toolkit, Vite, Tailwind CSS, Axios.
- **Backend**: Node.js, Express, Mongoose, Zod (for validation).
- **Database**: MongoDB.
