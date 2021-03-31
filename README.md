# Scale Fullstack Developer Assessment
## Original Requirements

In this excercise you will create a simple web application that contains a REST API and frontend UI which uses the API.

You are free to use any PHP framework to create the backend application.

Additionally you are free to use your choice of javascript libraries or frameworks to create the UI.

## Deliverables

Your application will need to be archived in a ZIP or TAR file and emailed to your recruiter.

Please be sure to exclude any "vendor" directories with third party libraries to keep the final archive size down.

Include instructions on how to run your application in a README.md file.

## API

You should create a REST API for "products" which provides the following endpoints to retrieve and modify products from a database.

#### GET /products

This endpoint will retrieve all of the products in the system.

The endpoint should accept the following query string parameters:

|Property|Default Value|Description|Example|
|--------|-------------|-----------|-------|
|page    | 0           | the page to retrieve | ?page=2
|limit   | 25          | the page size | ?limit=100
|sort    | id          | the property to sort by. add a minus to specify descending sort| ?sort=name<br>?sort=-name

```json
{
	"data": [
		{
			"id": 1,
			"name": "Product #1",
			"description": "A product description",
			"price": 29.95
		},
		{
			"id": 2,
			"name": "Product #2",
			"description": "A product description",
			"price": 49.95
		}
	]
}
```

---

#### POST /products

This endpoint will create a new user

Sample Request:

```json
{
	"name": "New Product",
	"description": "Another product description",
	"price": 19.95
}
```

Sample Response:

```json
{
	"id": 100,
	"name": "New Product",
	"description": "Another product description",
	"price": 19.95
}
```

---

#### GET /products/[ID]

This endpoint will retrieve a specific product.


Sample Response:

```json
{
	"id": 1,
	"name": "Product #1",
	"description": "A product description",
	"price": 29.95
}
```

---

#### PUT /products/[ID]

This endpoint will update a specific product.

Sample Request:

```json
{
	"name": "New Name",
	"description": "New description",
	"price": 99.95
}
```

Sample Response:

```json
{
	"id": 1,
	"name": "New Name",
	"description": "New description",
	"price": 99.95
}
```

---

#### DELETE /products/[ID]

This endpoint will delete a specific product.

## UI Application

Create a javascript application which uses your API to provide a simple admin-type interface which contains the following views.

### List View

This should display a table which lists all of the products returned from the API.

### Add Product View

This should display a form which allows a new product to be added.

### Edit Product View

This should display a form for an existing product to allow it to be modified.