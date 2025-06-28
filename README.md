A **node.js** and **Express.js** app that manages 5 small shops, a supply center an a main store

## How to run

#### Running using docker compose
This will automatically create the database, Redis, NGINX, prometheus/grafana and run 3 instances of the api:
- Run `docker compose up`
- Grafana URL is : `http://localhost:3001`
- API URL is : `http://localhost:80`

#### Swagger
- Swagger url is : `/api-docs`

#### Postman
- A postman collection is available for testing the api : `/docs/postman_collection.json`

#### Testing the project
- Run `npm test`

#### Stress testing with K6

- Install K6
- Run `k6 run k6.js`

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
4. Push Docker image to DockerHub under the repository *pebrassard/lab4*
