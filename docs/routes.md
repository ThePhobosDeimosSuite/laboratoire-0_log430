## ~~Sales report~~ (DEPRECATED SINCE MICROSERVICE)
Get the sales report of a specific store
- `
GET /api/store/{:id}/sales-report
`
#### Response
```json
{
    "sales": [
        {
            "isCancelled": false,
            "salesPrice": 10,
            "productSold": [
                {
                    "name": "concombre",
                    "price": 2,
                    "amount": 5
                }
            ]
        }
    ],
    "totalSalesPrice": 10,
    "mostSoldProduct": {
        "concombre": 5
    },
    "stocks": []
}
```

## ~~Dashboard~~ (DEPRECATED SINCE MICROSERVICE)
Get the admin dashboard view

- `GET /api/dashboard`

#### Response 
```json
{
    "allSalesPerStore": {
        "Store 1": "10048 $",
        "Store 2": "0 $",
        "Store 3": "10008 $",
        "Store 4": "0 $",
        "Store 5": "160 $"
    },
    "lowStocksPerStore": [
        {
            "storeId": 1,
            "lowStockProduct": [
                {
                    "name": "Salade",
                    "amount": 1
                }
            ]
        },
        {
            "storeId": 2,
            "lowStockProduct": []
        },
        {
            "storeId": 3,
            "lowStockProduct": [
                {
                    "name": "concombre",
                    "amount": 2
                }
            ]
        },
        {
            "storeId": 4,
            "lowStockProduct": []
        },
        {
            "storeId": 5,
            "lowStockProduct": []
        }
    ],
    "highStocksPerStore": [
        {
            "storeId": 1,
            "highStockProduct": [
                {
                    "name": "concombre",
                    "amount": 1000
                }
            ]
        },
    ]
}
```

# Stock service

## Get stock
Get the stocks for a specific store

- `GET /api/store/{:storeId}/stock`
- Query params: 
    - Pagination: **page, size, sort**

#### Response 
```json
[
    {
        "productId": 1,
        "amount": 10,
        "shopId": 1,
        "product": {
            "id": 1,
            "name": "concombre",
            "price": 2,
            "category": "légume"
        }
    }
]
```

## Add stock
Add stocks for a specific store

- `POST /api/store/{:storeId}/stock`

#### Body
```json
{
    "productId": 1,
    "amount": 5
}
```
# Product service
## Update product
Update product

- `PUT /api/product/{:productId}`

#### Body
```json
{
    "name": "citron",
    "category": "fruit",
    "price": 15
}
```

## Add product
Add product

- `POST /api/product`

#### Body
```json
{
    "name": "citron",
    "category": "fruit",
    "price": 15
}
```

## Search Product
Search product

- `GET /api/product`
- Query params:
    - Search: **id, name, category**
    - Pagination: **page, size, sort**

## Response 
```json
[
    {
        "id": 1,
        "name": "concombre",
        "price": 2,
        "category": "légume"
    }
]
```
# Sales service
## Get sales
Get sales for a specific store

- `GET /api/store/{:storeId}/sales`
- `GET /api/store/{:storeId}/sales/{:salesId}`
- Query params:
    - Pagination: **page, size, sort**

#### Response 
```json
[
    {
        "id": 3,
        "date": "2025-06-06T23:42:17.205Z",
        "isCancelled": false,
        "shopId": 1,
        "productSales": [
            {
                "id": 5,
                "productId": 3,
                "amount": 4,
                "salesId": 3,
                "product": {
                    "id": 3,
                    "name": "Salade",
                    "price": 10,
                    "category": "Légume"
                }
            }
        ],
        "totalPrice": 40
    },
]
```

## Create sales 
Create sales for a specific store

- `POST /api/store/{:storeId}/sales`

#### Body 
```json
{
    "productSales": [
        {
            "productId": 1,
            "amount": 4
        },
                {
            "productId": 2,
            "amount": 10
        }
    ]
}
```

## Cancel sales 
Cancel sales for a specific store

- `DELETE /api/store/{:storeId}/sales/{:salesId}`

# Account service

## Create account 
Create a new account

- `POST /api/account`

#### Body 
```json
{
    "name": "John Doe",
    "password": "123"
}
```

## Get all account
Get all account

- `GET /api/account`

#### Response 
```json
[
    {
        "name": "John Doe",
        "password": "123"
    }
]
```

# Shopping cart service

## Add shopping cart
Create a shopping cart with items for a specific account 
- `POST /api/store/{:storeId}/client/{:clientId}/cart`

#### Body 

```json
{
    "productSales": [
        {
            "productId": 1,
            "amount": 2
        }
    ]
}
```

## Get cart
Get the current shopping cart of an account
- `GET /api/store/{:storeId}/client/{:clientId}/cart`

#### Response 

```json
{
    "productSales": [
        {
            "productId": 1,
            "amount": 2
        }
    ]
}
```

## Checkout cart
Delete everyting in the cart and remove stock from stock service
- `POST /api/store/{:storeId}/client/{:clientId}/cart/checkout`

