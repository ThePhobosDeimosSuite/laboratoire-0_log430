A **node.js** and **Express.js** app that manages a small shop

## How to run

#### Running the project
- Clone repo
- Make sure node.js is installed locally
- Create a Postgresql database and add the url to `.env`
- Run `npm install`
- Run `npm run dev`

#### Running using docker compose
- Run `docker compose up --build`

#### Testing the project
- Run `npm test`

## File structure
This project is split into three folders:

1. `/src` has the source files of the project.
2. `/test` has the test files.
3. `/docs` has the documentation

## CI/CD
This repo has a pipeline with 4 differents steps:

1. Check syntaxe with ESLint
2. Run unit tests
3. Create Docker image
4. Push Docker image to DockerHub under the repository *pebrassard/lab0*

## Routes
Here are the main routes for the REST API

- `/product` : used to create a new product as such: 
    ```json
    {
        "data": {
            "name":"Chou",
            "stock": 40,
            "price": 3.99,
            "category": "Légume"
        }
    }
    ```

- `/product/search` : used to search product and the inventory. You can filter out a search using the query params: 
    
    - `?name=Comcombre`
    - `?category=Fruit`
    - `?id=2`

- `/sales` : create, get and update sales. Here's an example on how to create a sale: 
    ```json
    POST /sales
    {
        "data":
            [
                {
                    "productId": 1,
                    "amount" : 3
                },
                {
                    "productId": 3,
                    "amount" : 1
                }
            ]
    }
    ```
    A sale can also be cancelled as such : 
    ```json
    POST /sales/:id
    {
        "data": 
        {
            "isCancelled":true
        }
    }
    ```