[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=15442572&assignment_repo_type=AssignmentRepo)
# P2-Challenge-1 (Server Side)

> Tuliskan API Docs kamu di sini

# Branded Things(Graded Challenge 1) API Documentation

## Endpoints

List of available endpoints:

### Users
- `POST /add-user`
- `POST /login`

### Products

- `POST /products`
- `GET /products`
- `GET /products/:productId`
- `PUT /products/:productId`
- `DELETE /products/:productId`

### Categories

- `POST /categories`
- `GET /categories`
- `PUT /categories/:categoryId`
- `DELETE /categories/:categoryId`

### Products Public

- `GET /products/pub`
- `GET /products/pub/:productId`

## 1. POST /add-user

Description:
- Creating a new user with email, password, phoneNumber, address, and username as the request body. With access_token as the request header

- headers:
```json
{
    "access_token": "string"
}
```

Request:

- body:
```json
{
    "email": "string",
    "password": "string",
    "phoneNumber": "string",
    "address": "string",
    "username": "string"
}
```

_Response (201 - Created)_
```json
{
    "id": "integer",
    "email": "string",
    "phoneNumber": "string",
    "address": "string",
    "username": "string"
}
```

_Response (400 - Bad Request)_
```json
{
    "message": "Email is Required"
}
OR
{
    "message": "Invalid Email Format"
}
OR
{
    "message": "The Email is Already in Use"
}
OR
{
    "message": "Password is Required"
}
OR
{
    "message": "Minimum Password Length is 5"
}
```

## 2. POST /login

Description:
- Creating access token if the email and password is available match for login access

- body:
```json
{
    "email": "string",
    "password": "string",
}
```

_Response (201 - Created)_
```json
{
    "access_token": "string"
}
```

_Response (400 - Bad Request)_
```json
{
    "message": "Email and Password is Required"
}
```

_Response (401 - Unauthorized)_
```json
{
    "message": "Email or Password is Inavlid"
}
```

## 3. POST /products

Description:
- Creating a new product with name, description, price, stock, imgUrl, categoryId, authorId as the request body

- headers:
```json
{
    "access_token": "string"
}
```

Request:

- body:
```json
{
    "name": "string",
    "description": "string",
    "price": "integer",
    "stock": "integer",
    "imgUrl": "string",
    "categoryId": "integer",
    "authorId": "integer"
}
```

_Response (201 - Created)_
```json
{
    "id" : "integer",
    "name": "string",
    "description": "string",
    "price": "integer",
    "stock": "integer",
    "imgUrl": "string",
    "categoryId": "integer",
    "authorId": "integer",
    "createdAt": "date",
    "updatedAt": "date",
}
```

_Response (400 - Bad Request)_
```json
{
    "message": "Product Name is Required"
}
OR
{
    "message": "Product Description is Required"
}
OR
{
    "message": "Product Price is Required"
}
OR
{
    "message": "Minimum Product Price is Rp. 5.000,00"
}
OR
{
    "message": "Product Category is Required"
}
OR
{
    "message": "Product Author is Required"
}
```

&nbsp;

## 4. GET /products

Description:
- Getting the list of all Products including User model without password and Category model

- headers:
```json
{
    "access_token": "string"
}
```

_Response (200 - OK)_
```json
[
    {
        "id" : "integer",
        "name": "string",
        "description": "string",
        "price": "integer",
        "stock": "integer",
        "imgUrl": "string",
        "categoryId": "integer",
        "authorId": "integer",
        "createdAt": "date",
        "updatedAt": "date",
        "User": {
            "id" : "integer",
            "username": "string",
            "email": "string",
            "role": "string",
            "phoneNumber": "string",
            "address": "string",
            "createdAt": "date",
            "updatedAt": "date"
        },
        "Category": {
            "id" : "integer",
            "name": "string",
            "createdAt": "date",
            "updatedAt": "date"
        }
    }
    ...
]
```

&nbsp;

## 5. GET /products/:productId

Description:
- Getting Product data by id

- headers:
```json
{
    "access_token": "string"
}
```

- params:
```json
{
    "productId": "integer"
}
```

_Response (200 - OK)_
```json
{
    "id" : "integer",
    "name": "string",
    "description": "string",
    "price": "integer",
    "stock": "integer",
    "imgUrl": "string",
    "categoryId": "integer",
    "authorId": "integer",
    "createdAt": "date",
    "updatedAt": "date",
    "User": {
        "id" : "integer",
        "username": "string",
        "email": "string",
        "role": "string",
        "phoneNumber": "string",
        "address": "string",
        "createdAt": "date",
        "updatedAt": "date"
    },
    "Category": {
        "id" : "integer",
        "name": "string",
        "createdAt": "date",
        "updatedAt": "date"
    }
}
```

&nbsp;

_Response (404 - Not Found)_

```json
{
  "message": "Product with id <productId> not found"
}
```

&nbsp;

## 6. PUT /products/:productId

Description:
- Update Product data by id

- headers:
```json
{
    "access_token": "string"
}
```

- params:
```json
{
    "productId": "integer"
}
```

- body:
```json
{
    "name": "string",
    "description": "string",
    "price": "integer",
    "stock": "integer",
    "imgUrl": "string",
    "categoryId": "integer",
    "authorId": "integer"
}
```

_Response (200 - OK)_
```json
{
    "id" : "integer",
    "name": "string",
    "description": "string",
    "price": "integer",
    "stock": "integer",
    "imgUrl": "string",
    "categoryId": "integer",
    "authorId": "integer",
    "createdAt": "date",
    "updatedAt": "date"
}
```

_Response (400 - Bad Request)_
```json
{
    "message": "Product Name is Required"
}
OR
{
    "message": "Product Description is Required"
}
OR
{
    "message": "Product Price is Required"
}
OR
{
    "message": "Minimum Product Price is Rp. 5.000,00"
}
OR
{
    "message": "Product Category is Required"
}
OR
{
    "message": "Product Author is Required"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Product with id <productId> not found"
}
```

&nbsp;

## 7. DELETE /products/:productId

Description:
- Deelte Product data by id

- headers:
```json
{
    "access_token": "string"
}
```

- params:
```json
{
    "productId": "integer"
}
```

_Response (200 - OK)_
```json
{
    "message": "<Product Name> success to delete"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Product with id <productId> not found"
}
```

&nbsp;

## 8. POST /categories

Description:
- Creating a new category with name as the request body

- headers:
```json
{
    "access_token": "string"
}
```

Request:

- body:
```json
{
    "name": "string",
}
```

_Response (201 - Created)_
```json
{
    "id" : "integer",
    "name": "string",
    "createdAt": "date",
    "updatedAt": "date"
}
```

_Response (400 - Bad Request)_
```json
{
    "message": "Category Name is Required"
}
```

&nbsp;

## 9. GET /categories

Description:
- Getting the list of all Categories

- headers:
```json
{
    "access_token": "string"
}
```

_Response (200 - OK)_
```json
[
    {
        "id" : "integer",
        "name": "string",
        "createdAt": "date",
        "updatedAt": "date"
    }
    ...
]
```

&nbsp;

## 10. PUT /categories/:categoryId

Description:
- Update Category data by id

- headers:
```json
{
    "access_token": "string"
}
```

- params:
```json
{
    "categoryId": "integer"
}
```

- body:
```json
{
    "name": "string",
}
```

_Response (200 - OK)_
```json
{
    "id" : "integer",
    "name": "string",
    "createdAt": "date",
    "updatedAt": "date"
}
```

_Response (400 - Bad Request)_
```json
{
    "message": "Category Name is Required"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Category with id <categoryId> not found"
}
```

&nbsp;

## 11. DELETE /categories/:categoryId

Description:
- Delete Category data by id

- headers:
```json
{
    "access_token": "string"
}
```

- params:
```json
{
    "categoryId": "integer"
}
```

- body:
```json
{
    "name": "string",
}
```

_Response (200 - OK)_
```json
{
    "message": "<Category Name> success to delete"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Category with id <categoryId> not found"
}
```

&nbsp;

## 12. GET /pub/products/

Description:
- Getting the list of all Products including User model without password and Category model, for public site

_Response (200 - OK)_
```json
[
    {
        "id" : "integer",
        "name": "string",
        "description": "string",
        "price": "integer",
        "stock": "integer",
        "imgUrl": "string",
        "categoryId": "integer",
        "authorId": "integer",
        "createdAt": "date",
        "updatedAt": "date",
        "User": {
            "id" : "integer",
            "username": "string",
            "email": "string",
            "role": "string",
            "phoneNumber": "string",
            "address": "string",
            "createdAt": "date",
            "updatedAt": "date"
        },
        "Category": {
            "id" : "integer",
            "name": "string",
            "createdAt": "date",
            "updatedAt": "date"
        }
    }
    ...
]
```

&nbsp;

## 13. GET /pub/products/:productId

Description:
- Getting Product data by id, for public site

- params:
```json
{
    "productId": "integer"
}
```

_Response (200 - OK)_
```json
{
    "id" : "integer",
    "name": "string",
    "description": "string",
    "price": "integer",
    "stock": "integer",
    "imgUrl": "string",
    "categoryId": "integer",
    "authorId": "integer",
    "createdAt": "date",
    "updatedAt": "date",
    "User": {
        "id" : "integer",
        "username": "string",
        "email": "string",
        "role": "string",
        "phoneNumber": "string",
        "address": "string",
        "createdAt": "date",
        "updatedAt": "date"
    },
    "Category": {
        "id" : "integer",
        "name": "string",
        "createdAt": "date",
        "updatedAt": "date"
    }
}
```

&nbsp;

_Response (404 - Not Found)_

```json
{
  "message": "Product with id <productId> not found"
}
```

&nbsp;

## Global Errors

_Response (401 - Unauthorized)_

```json
{
  "message": "Invalid token"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal server error"
}
```