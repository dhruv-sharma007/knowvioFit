# KnowvioFit Backend

## Overview

KnowvioFit is a fitness tracking app that leverages AI to provide personalized fitness suggestions and track your physical activity. This robust backend API is designed for seamless integration with your frontend projects.

## Table of Contents
- [KnowvioFit Backend](#knowviofit-backend)
  - [Overview](#overview)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [API Routes](#api-routes)
    - [Server Default Routes](#server-default-routes)
    - [User Routes](#user-routes)
      - [Auth Routes](#auth-routes)
      - [Profile Routes](#profile-routes)
    - [Goal Routes](#goal-routes)
    - [AI Insights Routes](#ai-insights-routes)
  - [Environment Variables](#environment-variables)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation Steps](#installation-steps)
  - [Deployment](#deployment)
  - [Contributing](#contributing)
  - [License](#license)

## Features
- **User Authentication:** Secure registration, email verification, login, logout, and account deletion.
- **Profile Management:** Create, edit, and retrieve user profiles.
- **Goal Management:** Set, track, and complete fitness goals.
- **Activity Tracking:** Log and retrieve physical activities.
- **AI-Powered Insights:** Get personalized fitness recommendations based on user activity.
- **RESTful API:** Clean and predictable endpoints for easy integration with your frontend projects.
- **Production-Ready:** Environment configurations and deployment guidelines for a reliable production setup.

## API Routes

### Server Default Routes
- **GET** `/healthCheck`  
  _Purpose:_ Verify the server is up and running.

### User Routes

#### Auth Routes
- **POST** `/api/v1/user/register`  
  _Description:_ Register a new user.  
  _Parameters:_ `name`, `email`, `password`.

- **GET** `/api/v1/user/verifyemail/:id`  
  _Description:_ Trigger email verification.  
  _Note:_ Check your spam folder if the email isn't in your inbox.

- **POST** `/api/v1/user/login`  
  _Description:_ Authenticate a user using `email` and `password`.

- **GET** `/api/v1/user/get-current-user`  
  _Description:_ Get current user.  
  _Note:_ User must be logged in.

- **GET** `/api/v1/user/logout`  
  _Description:_ Log out the current user.

- **GET** `/api/v1/user/deleteuser`  
  _Description:_ Delete the currently authenticated user account.

#### Profile Routes
- **POST** `/api/v1/user/createprofile`  
  _Description:_ Create a new user profile.  
  _Parameters:_ `age`, `weight`, `height`, `fitnessGoal`.

- **POST** `/api/v1/user/editProfile`  
  _Description:_ Edit an existing user profile.  
  _Parameters:_ Any or many of `age`, `weight`, `height`, `fitnessGoal`.

- **GET** `/api/v1/user/getProfile`  
  _Description:_ Retrieve the current user's profile.

### Goal Routes
- **POST** `/api/v1/user/createGoal`  
  _Description:_ Create a new fitness goal.  
  _Parameters:_ 
  ```json
  {
    "targetValue": number,
    "progress": number,
    "goalType": "enum",
    "startDate": "string",
    "description": "string"
  }
  ```
  _Enums:_

  ```
  enum EGoalType {
	WeightLoss = "WEIGHT_LOSS",
	MuscleGain = "MUSCLE_GAIN",
	Endurance = "ENDURANCE",
	Flexibility = "FLEXIBILITY",
	GeneralFitness = "GENERAL_FITNESS",
	StrengthTraining = "STRENGTH_TRAINING",
  }
- **GET** `/api/v1/user/getGoal`  
  _Description:_ Retrieve the current user's fitness goals.

- **POST** `/api/v1/user/completeGoal/:goalId`  
  _Description:_ Mark a fitness goal as complete or incomplete.  
  _Parameters:_ `bool`

### Activity Routes
- **POST** `/api/v1/user/createActivity`  
  _Description:_ Log a new physical activity.  
  _Parameters:_ 

```json
{
  activityType: Enums,
  distance: number (optional),
  weightUsed: number (optional),
  reps: number (optional),
  sets: number (optional),
  time: number (in minutes)
}
````
  _Enums:_
  ```
  RUNNING, 
  CYCLING, 
  WEIGHTLIFTING, 
  SWIMMING, 
  WALKING, 
  YOGA, 
  HIKING, 
  ROWING, 
  ELLIPTICAL, 
  PILATES, 
  CROSSFIT,
  ZUMBA
  ```

- **GET** `/api/v1/user/get-activities`  
  _Description:_ Retrieve the current user's logged activities.
  this route have pagination: /api/v1/user/get-activities?page=2&limit=10

### AI Insights Routes
- **GET** `/api/v1/user/get-ai-insights`  
  _Description:_ Get personalized fitness recommendations based on user activity.

- **GET** `/api/v1/user/delete-ai-data`  
  _Description:_ delete ai data.

## Environment Variables

Before running the application, configure the following variables in a `.env` file:

```dotenv
PORT=8000
DB_URI="mongodb uri"
COOKIE_SECRET="securing cookies"
NODE_ENV="production or development"
MAIL_PASS="your gmail app password"
MAIL_ID="your mail id for sending email to user for verification"
URL_FOR_MAGIC_LINK="your frontend url where verifying user"
VERIFY_SECRET="user verification jwt secret"
ACCESS_SECRET="access token secret"
GEMINI_API_KEY="gemini api key"
```

## Getting Started

### Prerequisites
- Node.js (version 18.19.1 or later)
- NPM (or Bun)
- MongoDB (recommended for the database)
- A modern frontend framework (React, Vue, Angular, etc.) for integration

### Installation Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/dhruv-sharma007/knowvioFit.git
   ```

2. Navigate to the project directory:
   ```bash
   cd knowvioFit
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Configure your `.env` file with the environment variables shown above.

5. Run the development server:
   ```bash
   npm run dev
   ```

## Deployment

To deploy KnowvioFit in production:

1. Build the project:
   ```bash
   npm run build
   ```

2. Ensure environment variables are correctly configured on your production platform.

3. Deploy using your preferred provider (e.g., Render, Heroku, AWS).

   For example, on Render you might set the build command to:
   ```bash
   npm install && npm run build
   ```
   This ensures all dependencies are installed before building.

4. npm run start to start server.js in dist
## Contributing

Contributions are welcome. If you have suggestions, bug reports, or feature requests, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.