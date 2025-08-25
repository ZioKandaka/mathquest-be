# Mathquest Backend

A server for web application where user, mostly student, can learn about mathematic

# Tech Stacks

- NodeJS
- Express
- PostgreSQL
- Sequelize

# How to run locally

- Clone this repository to your machine
- Open terminal (bash) in root folder
- Use or switch to NodeJS version 22.12.0 (recommended)
- Run "npm i" on terminal
- Open .env file, located in root folder. Set the connection parameter for the database. Also set the value of client domain (FRONTEND_ORIGIN), this is necessary to bypass CORS validation
- Run "npm run db:init" on terminal. This will create database, run migration, and seeding
- Run "npm run dev" on terminal
- Server is running in local engine

# Available terminal scripts

- "npm run dev": run server
- "npm run db:init": Initialize the database creation which includes create database, run migration, and seeding database
- "npm run db:reset": undo all seeding and migration, then redo migration and seeding
- "npm run db:migrate": do migration
- "npm run db:migrate:undo": undo last migration
- "npm run db:migrate:undo:all": undo all migration
- "npm run db:seed": do seeding

# Troubleshoot

- If "npm run db:init" returns error, please check database connection configuration in .env file. Make sure that the connection is ready
- If "npm run dev" returns error, try running "npm i -g nodemon" then rerun "npm run dev"

# Answer of submission questions

* Time spent for this assesment
    I spent most of the time designing database schema, creating and testing API. This is because database is the crucial part for ensuring performance. A well designed and indexed database can smoothly handles more than ten thousand users. Here is the breakdown of how I spent my time:
    - 30% time for database design
    - 20% time for API creation
    - 20% time for testing API
    - 10% time for client interface (frontend) creation 
    - 10% time for API and database revision
    - 10% time for documentation

* What I did not build
    - Attractive animation and micro-interaction in frontend, when transitioning or navigating pages. Although animation is engaging, it is improvable after shipping the product
    - Two of the most needed pages: review lesson (explaination page for problems) and submission record page
    - Login and registration. This is standard practice is web app, but not needed for this assesment. For testing purposes, I create a feature to select which user to use
    - Caching. This is a standard practice to improve performance and reducing load, but not yet required for small application
    - Unit testing (automated). I usually build automated testing for long term application development convenience, but had no time in this assesment
    - Full code modularity. While most code are written modular with clear folder and path. Some of the code is improvable for maintainability

* What I prioritized
    - Core features: lesson submission with idempotency, xp calculation, streaks calculation, mandatory APIs, and mandatory interface
    - Database scalability and maintainability
    - API security and validation
    - Ease of running this application

* How would you keep teens motivated?
    There are two main things that I would focus to increase user motivation. Convenience during lesson and clear lesson review. User will stay motivated if the feel comfortable doing lesson. Lesson is where their most time is spent. Post-lesson reveal is only few seconds and their main focus is usually the score, not XP or streaks. After seeing their score, most user want to see explanation of the problem they get wrong. In this case, we rely more on the teacher that design the problem, answer, and explanation, rather than on the application developer. If the explanation is clear and student understand the lesson, they will be motivated to keep learning

* Product (Fokuslah) review
    - The theme of of this app is great
    - It is mobile friendly
    - Easy to register and login
    - There is a bug in lesson page where I restart the page and the timer also restart
    - Lesson should be navigable. User should be able to jump from problem 1 to problem 5, or reverse

* How you'd handle 1000+ students using this simultaneously
    I would do load testing on crucial API and evaluate query performance. Add caching for data that is often retrieved and index database based on queries. If this is not enough, then we might need to increase database specification (add more ram, upgrade CPU, etc)