# Task Management Application

## Description

The Task Management Application is a robust tool designed to help users efficiently manage their tasks. It features task creation, updates, deletions, and sorting based on various criteria. The application includes authentication and authorization mechanisms to ensure secure access and user management.

## Table of Contents

- [Features](#features)
- [Tools and Technologies](#tools-and-technologies)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Project Structure](#project-structure)

## Features

- **Task Management**: Create, update, and delete tasks.
- **Task Sorting**: Sort tasks by priority, due date, status, and creation date.
- **User Profile**: Add and manage profile pictures.
- **Authentication & Authorization**: Secure user authentication and authorization.
- **Access Control**: Prevent unauthorized access to pages.
- **User Sessions**: Signup, signin, and logout functionalities with persistent sessions for valid tokens.

## Tools and Technologies

- **Backend**: Node.js, Express.js
- **Frontend**: React.js, Material-UI

## Installation

### Backend

1. Clone the repository:
   ```bash
   git clone https://github.com/assassinscreed2/taskmanagement.git
   ```
2. Navigate to the backend directory:
   ```bash
   cd taskmanagement/backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Backend

1. Ensure all required environment variables are configured (see [Configuration](#configuration)).
2. Start the backend server:
   ```bash
   npm start
   ```

### Frontend

1. Ensure all required environment variables are configured (see [Configuration](#configuration)).
2. Start the frontend development server:
   ```bash
   npm start
   ```

## Configuration

### Backend

Ensure `dotenv` is installed and create a `.env` file in the backend directory with the following variables:

```env
PORT=<PORT>
CONNECTION_URL=<MONGODB CONNECTION URL>
SECRET_KEY=<SECRET KEY FOR JWT>
IMAGEKIT_PUBLIC_KEY=<IMAGEKIT PUBLIC KEY>
IMAGEKIT_PRIVATE_KEY="<IMAGEKIT PRIVATE KEY>
IMAGEKIT_URL_ENDPOINT=<IMAGEKIT URL ENDPOINT>
DEFAULT_PROFILE_IMAGE="<IMAGEKIT UTL ENDPOINT>/default-image.jpg"
```

### Frontend Configuration

Create a `.env` file in the `frontend` directory with the following content:

```env
REACT_APP_SERVER="http://localhost:<BACKEND SERVER PORT>"
```

## Project Structure

The project root directory contains two main folders:

- **backend**: Contains the Node.js backend code.
- **frontend**: Contains the React.js frontend code.
