# Hack the North 2023 Backend Submission

## Project Structure 🖥️
I followed a project architecture I believe was suitable for a small-mid sized backend system. 

- Routes are placed in `/src/routes`
- Services (route handlers mainly) are placed in `/src/services`
- Database initialization + important queries are placed in `/src/db/queries`
- Mock data used during initialization is placed in `/data`

Associated util files for certain services were placed in the corresponding service folder. 

## Key Features 💡
I successfully implemented the 5 major endpoints as per the project guidelines. These were:

- GET `/users`
- GET `/users/:id`
- PUT `/users/:id`
- GET `/skills`
- GET `/skills/?min_frequency=x&max_frequency=y`

## Additions ➕
I extended the base project by adding endpoints for user registration. As per the GitHub gist, these would most likely be used when attendees first arrive at the event. 

Specifically, I added:
- POST `/registration/:id/register`, used to register users
- POST `/registration/:id/unregister`, used to UNREGISTER users (in the event where they must leave the event at any point)
- GET `/users/:id/registration`, used to obtain a user's registration status

The changes involved required an additional column to be added to the `user` table. This column is NOT returned by the original endpoints required.


###### Thanks for taking a look at my submission!
#### Author: Kevin Pierce
