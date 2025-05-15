This is a **node.js** app that prints "Hello world!". 

## How to run

#### Running the project
- Clone repo
- Make sure node.js is installed locally
- Run `npm install`
- Run `npm start`

#### Launching using docker compose
- Run `docker compose up`

#### Testing the project
- Run `npm test`

## File structure
This project is split into two folders:

1. `/src` has the source files of the project.
2. `/test` has the test files.

## CI/CD
This repo has a pipeline with 4 differents steps:

1. Check syntaxe with ESLint
2. Run unit tests
3. Create Docker image
4. Push Docker image to DockerHub under the repository *pebrassard/lab0*