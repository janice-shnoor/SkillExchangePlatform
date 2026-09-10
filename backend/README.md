# Skill Exchange Backend

The backend uses REST API to handle authentication, user profiles, skill management, and exchanges.


## API Documentation

All the API routes use `/api`.

| API                  | Description                                                            |
| -------------------- | ---------------------------------------------------------------------- |
| `/auth`              | Handles user registration, login, logout, and password changes.        |
| `/admin`             | Allows admins to manage users and skills.                              |
| `/profile`           | Allows users to view and manage their profile and update their skills. |
| `/discover`          | Provides functionality to search for users based on skills.            |
| `/exchange-requests` | Handles the skill-exchange request workflow.                           |
| `/exchange`          | Manages exchanges and handles ratings.                                 |
| `/message`           | Handles messaging between users.                                       |

`GET /health` — Checks whether the API is running.
