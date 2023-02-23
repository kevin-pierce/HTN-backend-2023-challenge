# Hack the North 2023 Backend Submission

Thanks for taking a look at my submission!

## Project Structure
I followed a project architecture I believe was suitable for a small-mid sized backend system. 

- Routes are placed in `/src/routes`
- Services (route handlers mainly) are placed in `/src/services`
- Database initialization + large queries are placed in `/src/db`
- Mock data used during initialization is placed in `/data`

## Key Features
I successfully implemented the 5 major endpoints as per the project guidelines. These were:

- GET `/users`
- GET `/users/:id`
- PUT `/users/:id`
- GET `/skills`
- GET `/skills/?min_frequency=x&max_frequency=y`


#### Author: Kevin Pierce
