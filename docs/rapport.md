**Pierre-Émile Brassard**

Repo : https://github.com/ThePhobosDeimosSuite/laboratoire-0_log430

---

Projet is available in production here : log430@10.194.32.176

Run `docker compose build` and `docker compose up` in projet folder which is located at `~/lab0`

# Introduction and Goals

## Requirements Overview
A small business composed of 5 different shops, a supply center and a main shop needs an application to operate. As such, the app needs to keep track of sales and the inventory for each shop on top of a wide array of product. There's also an online shop where users can create an account and fill in their cart with items before checking out. 

## Quality Goals
 Data needs to be saved and shared amongst all the different users. The service has to be hosted on a VM.

## Stakeholders
| Name | Expectations |
| ---- | ------------ |
| Manger |  Create and update product. |
| Supply center employee | Deliver new stock to a store, see current stocks. |
|  Store employee | Search product, create sales, search sales, cancel sales, see stocks, order more stocks. |
| Online customer | Create an account, add items to cart, see items in cart, checkout. |

# System Scope and Context

## Business Context
The app has to execute 16 different use cases, each being initiated by request made to the REST API.

## Technical Context
Users will communicate with the service with http request. Data will then be stored in a database for persistence.


# Solution Strategy 
The service has been split into 6 different parts, each being implemented into a standalone microservice:
- Product
- Stocks
- Sales
- Account
- Shopping Cart

These will have their own database and be able to communicate with each other when needed. (For instance: reducing stocks after a sale)
An api gateway will analyse requests and forward it to the corresponding microservice.

# UML
## Class Diagram
@startuml class
title Class Diagram


package ProductMicroservice {
    class ProductService {
        + addProduct(name: String, category: String, price:Number): Void
        + updateProduct(productId:Number, name: String, category: String, price:Number): Void
        + searchProduct(productId:Number, name: String, category: String): Product
    }

    class Product {
        id: Number
        name: String
        category: String
        price: Number
    }
}

ProductService ..> Product

package StocksMicroservice {
    class StocksService {
        + addStocks(productId: Number, amount: Number, storeId: Number): Void
        + getStocks(productId: Number, storeId: Number): Stock
        + decrementStocks(productId: Number, amount: Number, storeId: Number): Void
        + addOrder(productId: Number, amount: Number, storeId: Number)
        + getOrder(): Order
    }
    class Order {
        amount: Number
        storeId: Number
    }

    class Stock {
        amount: Number
        storeId: Number
    }
}

StocksService ..> Stock
StocksService ..> Order


package SalesMicroservice {
    class SalesService {
        + createSales(productSales: ProductSales, storeId: Number): Void
        + getSales(salesId: String, storeId: Number): Sales
        + cancelSales(salesId: String, storeId: Number) : Void
    }
    class ProductSales {
        amount: Number
    }

    class Sales {
        date: DateTime
        isCancelled: Boolean
        storeId: Number
    }
}

SalesService ..> ProductSales
SalesService ..> Sales

package AccountMicroservice{
    class AccountService {
        + createAccount(name: String, password: String): Void
        + getAllAccount(): Account[]
    }

    class Account {
        name: String
        password: String
    }
}

AccountService ..> Account

package ShoppingCartMicroservice {
    class ShoppingCartService{
        + addItemsToCart(productSalesCart: ProductSalesCart, storeId: Number, accountId: Number): Void
        + getCart(storeId: Number, accountId: Number): Sales
        + checkoutCart(storeId: Number, accountId: Number): Void
    }

    class ProductSalesCart as "ProductSales" {
        amount: Number
    }

    class SalesCart as "Sales" {
        date: DateTime
        storeId: Number
    }
}

ShoppingCartService ..> ProductSalesCart
ShoppingCartService ..> SalesCart
ShoppingCartService ..> StocksService



Sales "1" *-- "*" ProductSales

SalesCart "1" *-- "*" ProductSalesCart

ProductSalesCart "*" o-- "1" Product

ProductSalesCart "0..1" o-- "1" Account

ProductSales "*" o-- "1" Product

Stock "*" o-- "1" Product

Order "*" o-- "1" Product

@enduml

## Deployement view

@startuml deployement
title Deployement Diagram

node "Monitoring container" {
    artifact Prometheus
    artifact Grafana
}

node "Kong" {

}

node "Kafka" {

}

node "Product Database" {
    database "PostgreSQL" as ProductDB
}

node "Product Service"  {
    artifact ProductServer
    artifact ProductService
    artifact "Prisma" as ProductPrisma
}

    [Kong] --> [ProductServer]
    [ProductServer] --> [ProductService]
    [ProductService] --> [Prometheus]
    [ProductService] --> [ProductPrisma]
    [ProductPrisma] --> [ProductDB]

node "Sales Database" {
    database "PostgreSQL" as SalesDB
}

node "Sales Service"  {
    artifact SalesServer
    artifact SalesService
    artifact "Prisma" as SalesPrisma
}

    [Kong] --> [SalesServer]
    [SalesServer] --> [SalesService]
    [SalesService] --> [Prometheus]
    [SalesService] --> [SalesPrisma]
    [SalesPrisma] --> [SalesDB]

node "Stocks Database" {
    database "PostgreSQL" as StocksDB
}

node "Stocks Service"  {
    artifact StocksServer
    artifact StocksService
    artifact "Prisma" as StocksPrisma
}

    [Kong] --> [StocksServer]
    [StocksServer] --> [StocksService]
    [StocksService] --> [Prometheus]
    [StocksService] --> [StocksPrisma]
    [StocksPrisma] --> [StocksDB]

    [SalesService] --> [Kafka]
    [Kafka] --> [StocksService]


node "Account Database" {
    database "PostgreSQL" as AccountDB
}

node "Account Service"  {
    artifact AccountServer
    artifact AccountService
    artifact "Prisma" as AccountPrisma
}

    [Kong] --> [AccountServer]
    [AccountServer] --> [AccountService]
    [AccountService] --> [Prometheus]
    [AccountService] --> [AccountPrisma]
    [AccountPrisma] --> [AccountDB]

node "ShoppingCart Database" {
    database "PostgreSQL" as ShoppingCartDB
}

node "ShoppingCart Service"  {
    artifact ShoppingCartServer
    artifact ShoppingCartService
    artifact "Prisma" as ShoppingCartPrisma
}

    [Kong] --> [ShoppingCartServer]
    [ShoppingCartServer] --> [ShoppingCartService]
    [ShoppingCartService] --> [Prometheus]
    [ShoppingCartService] --> [ShoppingCartPrisma]
    [ShoppingCartPrisma] --> [ShoppingCartDB]

    [ShoppingCartService] --> [Kafka]

    [ProductService] --> [Kafka]


    [Prometheus] --> [Grafana]
@enduml

---

## Component view
@startuml component
skinparam componentStyle rectangle
skinparam defaultTextAlignment center

package "API Gateway" {
  [Kong]
}

package "Monitoring" {
  [Prometheus]
  [Grafana]
}

package "Shared Code" {
  [shared-utils] as SharedUtils
}

cloud "Kafka" {
}

package "Microservices" {
  component Product
  component Sales
  component Stocks
  component Account
  component ShoppingCart
}

database "ProductDB" as dbProduct
database "SalesDB" as dbSales
database "StocksDB" as dbStocks
database "AccountDB" as dbAccount
database "CartDB" as dbCart


Kong --> Product
Kong --> Sales
Kong --> Stocks
Kong --> Account
Kong --> ShoppingCart

SharedUtils ..> Product
SharedUtils ..> Sales
SharedUtils ..> Stocks
SharedUtils ..> Account
SharedUtils ..> ShoppingCart

Product --> dbProduct
Sales --> dbSales
Stocks --> dbStocks
Account --> dbAccount
ShoppingCart --> dbCart

Sales --> Kafka
Stocks --> Kafka
ShoppingCart --> Kafka

Prometheus --> Product
Prometheus --> Sales
Prometheus --> Stocks
Prometheus --> Account
Prometheus --> ShoppingCart

Grafana --> Prometheus

@enduml



---

## Use case 
@startuml use_case
title Use case
actor User


usecase "Create Account" as UC1
usecase "Get all Account" as UC2

usecase "Checkout Sales" as UC3

usecase "Add Product" as UC4
usecase "Search Product" as UC5
usecase "Update Product" as UC6

usecase "Cancel Sales" as UC7
usecase "Create Sales" as UC8
usecase "Get Sales" as UC9

usecase "Add item to cart" as UC10
usecase "Clear cart" as UC11
usecase "Get cart" as UC12

usecase "Add order" as UC13
usecase "Add stocks" as UC14
usecase "Get order" as UC15
usecase "Get stocks" as UC16


User --> UC1
User --> UC2
User --> UC3
User --> UC4
User --> UC5
User --> UC6
User --> UC7
User --> UC8
User --> UC9
User --> UC10
User --> UC11
User --> UC12
User --> UC13
User --> UC14
User --> UC15
User --> UC16


@enduml

---

### Create account

@startuml create-account
title Create account
actor User

User -> Kong : createAccount(name: String, password: String)
Kong -> AccountService : createAccount(name: String, password: String)
AccountService --> Kong  :Success
Kong --> User : Success
@enduml

### Get all account

@startuml get-all-account
title Get all account
actor User

User -> Kong : getAllAccount()
Kong -> AccountService : getAllAccount()
AccountService --> Kong  :Account[]
Kong --> User : Account[]
@enduml

### Checkout sales

@startuml checkout-sale
title Checkout sale
actor User

User -> Kong :checkoutCart(storeId: Number, accountId: Number)
Kong -> ShoppingCartService : checkoutCart(storeId: Number, accountId: Number)
ShoppingCartService -> StocksService : decrementStocks(productId: Number, amount: Number, storeId: Number)
StocksService --> ShoppingCartService  :Success
ShoppingCartService --> Kong  :Success
Kong --> User : Success
@enduml

### Add product

@startuml add-product
title Add Product
actor User

User -> Kong : addProduct(name: String, category: String, price:Number)
Kong -> ProductService : addProduct(name: String, category: String, price:Number)
ProductService --> Kong  :Success
Kong --> User : Success
@enduml

### Search product

@startuml search-product
title Seach Product
actor User

User -> Kong : searchForProduct(id:Number, name:String, category:String)
Kong -> ProductService : searchForProduct(id:Number, name:String, category:String)
ProductService --> Kong : Product
Kong --> User : Product

@enduml

### Update product 

@startuml update-product
title Update Product
actor User

User -> Kong : updateProduct(id:Number, name: String, category: String, price:Number)
Kong -> ProductService : updateProduct(id:Number, name: String, category: String, price:Number)
ProductService --> Kong : Product
Kong --> User : Product
@enduml

### Cancel sales

@startuml cancel-sales
title Cancel Sales
actor User

User -> Kong : cancelSales(salesId: String, storeId: Number)
Kong -> SalesService : cancelSales(salesId: String, storeId: Number)
SalesService --> StocksService : incrementStocks(productId: Number, amount: Number, storeId: Number)
StocksService --> SalesService : Done
SalesService --> Kong : Done
Kong --> User : Done
@enduml

### Create sales

@startuml create-sales
title Create Sales
actor User

User -> Kong : createSales(productSales: ProductSales, storeId: Number)
Kong -> SalesService : createSales(productSales: ProductSales, storeId: Number)
SalesService --> StocksService : decrementStocks(productId: Number, amount: Number, storeId: Number)
StocksService --> SalesService : Done
SalesService --> Kong : Done
Kong --> User : Done
@enduml

### Get sales

@startuml get-sales
title Get Sales
actor User

User -> Kong : getSales(salesId: String, storeId: Number)
Kong -> SalesService : getSales(salesId: String, storeId: Number)
SalesService -> Kong : Sales[]
Kong -> User : Sales[]

@enduml

### Add items to cart

@startuml add-item-to-cart
title Add items to cart
actor User

User -> Kong : AddItemsToCart(productSalesCart: ProductSalesCart, storeId: Number, accountId: Number)
Kong -> ShoppingCartService : AddItemsToCart(productSalesCart: ProductSalesCart, storeId: Number, accountId: Number)
ShoppingCartService --> Kong : Done
Kong --> User : Done
@enduml

### Clear cart

@startuml clear-cart
title Clear cart
actor User

User -> Kong : ClearCart(storeId: Number, accountId: Number)
Kong -> ShoppingCartService : ClearCart(storeId: Number, accountId: Number)
ShoppingCartService --> StocksService : decrementStocks(productId: Number, amount: Number, storeId: Number)
StocksService --> ShoppingCartService : Done
ShoppingCartService --> Kong : Done
Kong --> User : Done
@enduml

### Get cart 

@startuml get-cart
title Get cart
actor User

User -> Kong : GetCart(storeId: Number, accountId: Number): Sales
Kong -> ShoppingCartService : GetCart(storeId: Number, accountId: Number): Sales
ShoppingCartService --> Kong : Sales
Kong --> User : Sales
@enduml

### Add order

@startuml add-order
title Add Order
actor User

User -> Kong : addOrder(productId: Number, amount: Number, storeId: Number)
Kong -> StockService : addOrder(productId: Number, amount: Number, storeId: Number)
StockService --> Kong : Success
Kong --> User : Success

@enduml

### Add stocks 

@startuml add-stocks
title Add Stocks
actor User

User -> Kong : addStocks(productId: Number, amount: Number, storeId: Number)
Kong -> StockService : addStocks(productId: Number, amount: Number, storeId: Number)
StockService --> Kong : Success
Kong --> User : Success

@enduml

### Get order

@startuml get-order
title Get Order
actor User

User -> Kong : getOrder(productId: Number, storeId: Number)
Kong -> StockService : getOrder(productId: Number, storeId: Number)
StockService --> Kong : Order
Kong --> User : Order
@enduml

### Get stocks

@startuml get-stocks
title Get Stocks
actor User

User -> Kong : getStocks(productId: Number, storeId: Number)
Kong -> StockService : getStocks(productId: Number, storeId: Number)
StockService --> Kong : Stocks
Kong --> User : Stocks
@enduml


# Design Decisions 
### Kafka 
#### Context
Each microservice has it's own database, which means we need a way to tell the *StocksService* when a sales has been completed. We thus need a library to allow microservices to speak to each other and stay up to date.

#### Decision
An event based messaging system like *Kafka* would allow microservices to send messages between each other and stay in sync.

#### Status
Accepted

#### Consequence
After a sale has been complete, the *SalesService* will send an event to the *StocksService* to decrease the stock of the sold items.

When starting the project using *docker-compose*, there's no way of waiting until *Kafka* has initialized before sending request to it. Hence, the microservices start sending message while *Kafka* is still down and i wasn't able to find a good way to fix this. 

Also, i can't find a way to make Kafka work with Jest, which means that the unit tests can't run anymore for any service implementing a Kafka consumer/producer. 

---
### Shared utils
#### Context
The project being split into 6 smaller ones, some piece of code can be used between two or more  microservices.

#### Decision
Using the *workspaces* feature in *npm*, it's possible to create a `/shared-utils` and import it has a package to each individual microservice. As such, code used to parse request body can be shared.

#### Status
Accepted

#### Consequence
This is great because it avoids copying code but i've had issues with the implementation. Packaging each microservice to a docker image was really difficult because the `/shared-utils` folder has to be included. Also, I've had so many issues with `rootdir` in `jest.config.ts` ~~and to this day running *jest* on Linux still isn't working.~~ **UPDATE**: After working on *lab6*, I found a way to make Jest work on Linux, the fix is implemented in *lab5*.



# Risks and Technical Debts
### Jest
~~Like mentionned previously, *jest* doesn't work on Linux because of the shared packages between microservices~~. It's also very annoying to test with *jest* because you need a database up and running with the correct schema. A different connection URL to *PostgreSQL* is defined in `jest.setup.js` but it's not the cleanest way in my opinion. (**Edit:** This should be somewhat fixed in *lab7* as I've added a way to mock the database)

To run Jest, you need to manually generate the prisma client with `npx generate prisma` and build with `npm run build` for **each** modules beforehand. This is annoying.

Also, any service that has a Kafka producer/consumer doesn't run with Jest which is definitely something that has to be fixed at some point because the unit test for SalesService always fail now.  
### Docker image
Each microservice generates a huge docker image. I had a lot of issues trying to add the `/shared-utils` to each image so instead i'm copying the entire project to each image (minus what's defined in .dockerignore). This on top of `/node_modules` taking around 300MB means alot of storage and memory is taken by Docker.
### Adding product description
When looking up the stocks of a store you get the productId. Before changing everything to a microservice architecture it was pretty easy to incorporate the product information to the request as such :
```json
{
    "productId": "1",
    "product": {
        "name": "Orange",
        "price" : 5
    }
}
```

But now the *StocksService* doesn't have access to the product information so we get less info, which is the reason why the dashboard and sales-report are deprecated now. A way to fix this would be to have the api gateway query the *ProductService* and append the info.


# Technology chosen

### Node.js
*Javascript* is untyped so it's flexible with how it processes data. I think it's useful when creating a small app where you don't really want to pay too much attention to what type a certain field is and instead focus on making the app work.

### Typescript
I still think having types is handy sometimes, of instance it can be useful when dealing with data coming from the ORM.

### Prisma
I've never worked with this library before, but there seems to be a huge amount of documentation online. I'm also somewhat unfamiliar with ORMs so i just asked *ChatGPT* for the best library for this particular project.

### Jest
This is what I've always used. It was my first time setting up the environment for Jest and I had a hard time making it work with *ESM* and *Typescript*.

### Kafka
I've never implemented a system like *Kafka*, so i picked this one because it's well known and popular. 

### Kong
I used Apollo in another project which i quite liked, but this was the chance to try something new. I had a real hard time with the documentation for *Kong* so i ended up relying alot on *ChatGPT* which wasn't any better.


## File structure
- `/src/module` has all of the microservices, which the structure is defined below.
- `/src/shared-utils` has common code shared between all the microservices.


#### Microservice
- `/test` has the unit tests.
- `/prisma` contains the database schema.  
- `/src` has the source files for the microservice. 