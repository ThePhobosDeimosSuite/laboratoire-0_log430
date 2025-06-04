# A look back at lab0/lab1
After reading the requirement for lab2, i don't think a REST API is a good idea. First thing I'll do is to port everything to an MVC architecture with *terminal-kit* and then work on implementing the features for lab2. At least i won't have to change anything regarding the controller and database.

# Lab2
`/view` is split into the 3 different types of users found in the app (*store-employee, supply-center-employee, manager*). Each subfolder contains individual files for each interface. For instance there's a file which will print out the interface to search for a product. There's also a menu screen for each user giving access to the previously mentioned interfaces.

`/controller` is also split into the 3 different types of users. These controllers contain the methods used to send and retrieve data from the database. `manager.ts` inherits from `supply-center-employee.ts`  which inhertits from `store-employee.ts`.

`/utils` has various methods used all around the app, like a custom method to output *json* or a custom method to ask the user to enter a *string*.  

## How to run

#### Running the project
- Clone repo
- Make sure node.js is installed locally
- Create a Postgresql database and add the url to `.env`
- Run `npm install`
- Run `npm run build`
- Run `npm run start`

#### Running using docker compose
- Run `docker compose up --build`

#### Testing the project
- Run `npm test`

# Technology chosen

### Node.js
*Javascript* is untyped so it's flexible with how it processes data. I think it's useful when creating a small app where you don't really want to pay too much attention to what type a certain field is and instead focus on making the app work.

### Typescript
I still think having types is handy sometimes, of instance it can be useful when dealing with data coming from the ORM.

### Terminal-kit
I've never used this library before, but from what I've seen on the readme page it seems to be a very versatile tool. Simple tasks like asking the user for input can also be done very easily.

### Prisma
I've never worked with this library before, but there seems to be a huge amount of documentation online. I'm also somewhat unfamiliar with ORMs so i just asked *ChatGPT* for the best library for this particular project.

### Jest
This is what I've always used. It was my first time setting up the environment for Jest and I had a hard time making it work with *ESM* and *Typescript*.