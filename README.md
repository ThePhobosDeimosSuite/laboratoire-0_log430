A **node.js** and **Express.js** microservice app that manages 5 small shops, a supply center, a main store and an online shop.

The physical store is handled by these microservices:
    
- *Product-service*
- *Sales-service*
- *Stocks-service*

The online store by:

 - *Account-service*
 - *Shopping-cart-service*
 - *Online-Sales-Orchestrator*

 And the Package delivery system is handled by :
- *Package-service*
- *Email-service*
- *Event-Store-Service*

Everything is packed together using Kong as the API gateway

#### Online Sales Orchestrator
When adding one or multiple products to a shopping cart, the request will be forwarded to the online sales orchestrator which will :
- Check remaining stocks
    - If not enough stocks, cancel transaction 
- Reserve stocks
- Create a shopping cart entry
    - If shopping cart already exists, cancel transation and unlock reserve stocks
- Send the total due amount to the user

When a user tries to checkout their shopping cart, the online sales orchestrator will:
- Get total cart price
- Check if payment is enough
    - Create new sales if payment is accepted
    - Release reserve stocks if payment is denied
- Delete items from shopping cart


## How to run

#### Running using docker compose
- Run `docker compose build`
- Run `docker compose up`
- Grafana URL is : `http://localhost:3001`
- Kong URL is : `http://localhost:8000`

#### Swagger
Each service has a Swagger url:
- *Product-service*: `localhost:4000/api-docs`
- *Sales-service*: `localhost:4001/api-docs`
- *Stocks-service*: `localhost:4002/api-docs`
- *Account-service*: `localhost:4003/api-docs`
- *Shopping-cart-service*: `localhost:4004/api-docs`
- *Online-Sales-Orchestrator*: `localhost:4005/api-docs`

#### Postman
- A postman collection is available for testing the api : `/docs/postman_collection.json`

#### Testing the project
- Run `npm run test`

    - Each service can be tested individually: `npm run test:product`, `npm run test:sales` or `test:onlineSalesOrchestrator`

#### Stress testing with K6

- Install K6
- Run `k6 run k6.js`

## File structure
This project is split into three folders:

1. `/src/module` contains the microservices.
2. `/src/shared-utils` has code that's shared between each microservice.
3. `/docs` has the documentation.

## API routes
There's a basic authentication service protecting the api. Credentials are :
- Username: *admin*
- Password: *123*

Routes are available with example here: `/docs/routes.md`

## CI/CD
Each microservice has its own pipeline with 4 differents steps:

1. Check syntaxe with ESLint
2. Create PostgreSQL database and run unit tests
3. Create Docker image
4. Push Docker image to DockerHub under the repository *pebrassard*
