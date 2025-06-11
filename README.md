A **node.js** and **Express.js** app that manages 5 small shops, a supply center an a main store

## How to run
#### Running the project
- Clone repo
- Make sure *node.js* is installed locally
- Create a *Postgresql* database and add the url to `.env`
    - OR run this command: `docker run -d --name postgres -e POSTGRES_PASSWORD=123 -p 5432:5432 postgres`
- Run `npm install`
- Run `npm run build`
- Run `npx prisma generate`
- Run `npx prisma migrate deploy`
    - **CLI**: Run `npm run start`
    - **API**: Run `npm run api`

#### Running using docker compose
This will automatically create the database, launch prometheus/grafana and run the api:
- Run `docker compose up`

#### Swagger
- Swagger url is : `/api-docs`

#### Grafana
- 

#### Postman
- A postman collection is available for testing the api : `/docs/postman_collection.json`


#### Testing the project
- Run `npm test`

#### Stress testing with K6

## File structure
This project is split into three folders:

1. `/src` has the source files of the project.
2. `/test` has the test files.
3. `/docs` has the documentation.

## API routes
There's a basic authentication service protecting the api. Credentials are :
- Username: *admin*
- Password: *123*

Routes are available with example here: `/docs/routes.md`

## CI/CD
This repo has a pipeline with 4 differents steps:

1. Check syntaxe with ESLint
2. Create PostgreSQL database and run unit tests
3. Create Docker image
4. Push Docker image to DockerHub under the repository *pebrassard/lab3*
