A **node.js** app that manages 5 small shops, a supply center an a main store

## How to run

#### Running the project
- Clone repo
- Make sure node.js is installed locally
- Create a Postgresql database and add the url to `.env`
    - OR run this command: `docker run -d --name postgres -e POSTGRES_PASSWORD=123 -p 5432:5432 postgres`
- Run `npm install`
- Run `npm run build`
- Run `npx prisma generate`
- Run `npx prisma migrate deploy`
- Run `npm run start`

#### Running using docker compose
This will automatically create the database and run the api:
- Run `docker compose up`


**TODO add run api**
add swagger url
add endpoint documentation /docs
add postman request to /docs

#### Testing the project
- Run `npm test`

## File structure
This project is split into three folders:

1. `/src` has the source files of the project.
2. `/test` has the test files.
3. `/docs` has the documentation.

## CI/CD
This repo has a pipeline with 4 differents steps:

1. Check syntaxe with ESLint
2. Create PostgreSQL database and run unit tests
3. Create Docker image
4. Push Docker image to DockerHub under the repository *pebrassard/lab2*
