# Repository only talks to DB.
# Business logic goes here.

1. Authentication Service

The backend uses a centralized JWT-based authentication system with role-based authorization.

Supported roles:
- admin
- farmer
- merchant

Public signup is allowed only for:
- farmer
- merchant

Admin signup is restricted and handled internally through backend scripts/create_admin.py access.

All users use the same login API. The backend automatically identifies the user role and returns it in the response. Frontend applications should redirect users to the appropriate dashboard based on the returned role.

Protected APIs require a valid JWT token in the Authorization header.

Future authentication enhancements such as OTP verification and refresh tokens can be added without major architecture changes due to the modular auth design.

Example Signup Request

POST /api/v1/auth/signup

{
  "name": "Balraje",
  "phone": "9766863091",
  "password": "12345678",
  "role": "farmer"
}


Example Login Request

POST /api/v1/auth/login

{
  "phone": "9766863091",
  "password": "12345678"
}


Example Success Response

{
  "access_token": "jwt_token",
  "token_type": "bearer",
  "user": {
    "id": "6819e7c2c8f24f6c0c4f1234",
    "name": "Balraje",
    "role": "farmer"
  }
}


Authorization Header Example

Authorization: Bearer <access_token>



----------------------------------------------------------------------------------

# Farm Service | Farm API

The Farm Service manages farmer-owned farm records and farm image storage.

Only users with the `farmer` role can access farm APIs.

Farm images are uploaded to AWS S3.

The farm module supports:
- Create Farm
- Get All Farms
- Search Farms
- Get Farm By ID
- Update Farm
- Delete Farm

Search currently uses MongoDB regex search with:
- case-insensitive matching
- partial keyword matching

Protected APIs require a valid JWT token in the Authorization header.

Authorization Header Example

Authorization: Bearer <access_token>


Example Create Farm Request

POST /api/v1/farms

Content-Type: multipart/form-data

farm_name = Balraje Farm
acres = 2
location = Goradwadi
soil_type = Black
farm_photo = image.jpg


Example Search Farms Request

GET /api/v1/farms?search=bal


Example Success Response

{
  "message": "Farm created successfully",
  "farm_id": "6819e7c2c8f24f6c0c4f1234"
}

# Crop Service | Crop API

The Crop Service manages crop records associated with farmer-owned farms.

Only users with the `farmer` role can access crop APIs.

The crop module supports:

* Create Crop
* Get All Crops
* Search Crops
* Filter Crops
* Get Crop By ID
* Update Crop
* Delete Crop

Financial year is automatically generated from the sowing date.

Crop listing supports filtering by:

* financial year
* farm
* season
* search keyword

Protected APIs require a valid JWT token in the Authorization header.

Authorization Header Example

Authorization: Bearer <access_token>

Example Create Crop Request

POST /api/v1/crops

{
"farm_id": "6819e7c2c8f24f6c0c4f1234",
"crop_name": "Cotton",
"season": "Kharif",
"sowing_date": "2026-06-01",
"expected_harvest_date": "2026-11-01"
}

Example Get All Crops Request

GET /api/v1/crops

Example Search Crops Request

GET /api/v1/crops?search=cott

Example Filter Crops Request

GET /api/v1/crops?financial_year=2026-2027&season=Kharif

Example Success Response

[
{
"id": "6820e7c2c8f24f6c0c4f5678",
"farm_id": "6819e7c2c8f24f6c0c4f1234",
"financial_year": "2026-2027",
"crop_name": "Cotton",
"season": "Kharif",
"sowing_date": "2026-06-01T00:00:00",
"expected_harvest_date": "2026-11-01T00:00:00"
}
]

Frontend Notes

* Frontend should call GET /api/v1/farms to populate the farm dropdown while creating crops.
* Crop list currently returns farm_id. Frontend should map farm_id with farm_name using the farms API response.
* Search currently uses MongoDB regex search with:

  * case-insensitive matching
  * partial keyword matching
 

---

# Fertilizer Service | Fertilizer API

The Fertilizer Service manages fertilizer usage history records for farmers.

Only users with the `farmer` role can access fertilizer APIs.

The fertilizer module is designed for:

* fertilizer usage tracking
* yearly fertilizer usage history
* future fertilizer planning
* fertilizer consumption analytics

The fertilizer module does NOT handle:

* expense tracking
* financial calculations
* purchase accounting

Financial data is managed separately through the Expense module.

The fertilizer module supports:

* Create Fertilizer Record
* Get All Fertilizer Records
* Search Fertilizers
* Filter Fertilizers
* Get Fertilizer By ID
* Update Fertilizer
* Delete Fertilizer

Financial year is automatically generated from the fertilizer application date.

Fertilizer listing supports filtering by:

* financial year
* search keyword

Search currently uses MongoDB regex search with:

* case-insensitive matching
* partial keyword matching

Duplicate fertilizer records with the same:

* fertilizer_name
* quantity
* application_date
* financial_year

are restricted for the same user.

Protected APIs require a valid JWT token in the Authorization header.

Authorization Header Example

```txt id="doc1"
Authorization: Bearer <access_token>
```

Example Create Fertilizer Request

POST /api/v1/fertilizers

```json id="doc2"
{
  "fertilizer_name": "Urea",
  "quantity": 10,
  "unit": "Bags",
  "application_date": "2026-05-13T10:05:38.301Z",
  "notes": "Future storing"
}
```

Example Get All Fertilizers Request

```txt id="doc3"
GET /api/v1/fertilizers
```

Example Search Fertilizers Request

```txt id="doc4"
GET /api/v1/fertilizers?search=urea
```

Example Filter Fertilizers Request

```txt id="doc5"
GET /api/v1/fertilizers?financial_year=2026-2027
```

Example Success Response

```json id="doc6"
[
  {
    "id": "6a04c83a20831aea477397fb",
    "financial_year": "2026-2027",
    "fertilizer_name": "Urea",
    "quantity": 10,
    "unit": "Bags",
    "application_date": "2026-05-13T10:05:38.301Z",
    "notes": "Future storing"
  }
]
```

Frontend Notes

* Frontend should NOT ask users for financial_year. Backend automatically generates it from application_date.
* Update Fertilizer API supports partial updates using PATCH request.
* Frontend should prevent duplicate submissions by disabling submit button during API request.
* Fertilizer module tracks only fertilizer usage history.
* Expense-related fertilizer spending is handled separately in the Expense module.
* Search currently uses MongoDB regex search with:

  * case-insensitive matching
  * partial keyword matching

---

# Pesticide Service | Pesticide API

The Pesticide Service manages pesticide usage history records for farmers.

Only users with the `farmer` role can access pesticide APIs.

The pesticide module is designed for:

* pesticide usage tracking
* yearly pesticide usage history
* future pesticide planning
* pesticide consumption analytics

The pesticide module does NOT handle:

* expense tracking
* financial calculations
* purchase accounting

Financial data is managed separately through the Expense module.

The pesticide module supports:

* Create Pesticide Record
* Get All Pesticide Records
* Search Pesticides
* Filter Pesticides
* Get Pesticide By ID
* Update Pesticide
* Delete Pesticide

Financial year is automatically generated from the pesticide application date.

Pesticide listing supports filtering by:

* financial year
* search keyword

Search currently uses MongoDB regex search with:

* case-insensitive matching
* partial keyword matching

Duplicate pesticide records with the same:

* pesticide_name
* quantity
* application_date
* financial_year

are restricted for the same user.

Protected APIs require a valid JWT token in the Authorization header.

Authorization Header Example

```txt id="doc7"
Authorization: Bearer <access_token>
```

Example Create Pesticide Request

POST /api/v1/pesticides

```json id="doc8"
{
  "pesticide_name": "Insecticide X",
  "quantity": 5,
  "unit": "Liter",
  "application_date": "2026-05-13T10:05:38.301Z",
  "notes": "Applied after pest detection"
}
```

Example Get All Pesticides Request

```txt id="doc9"
GET /api/v1/pesticides
```

Example Search Pesticides Request

```txt id="doc10"
GET /api/v1/pesticides?search=insect
```

Example Filter Pesticides Request

```txt id="doc11"
GET /api/v1/pesticides?financial_year=2026-2027
```

Example Success Response

```json id="doc12"
[
  {
    "id": "6a04c83a20831aea477397fb",
    "financial_year": "2026-2027",
    "pesticide_name": "Insecticide X",
    "quantity": 5,
    "unit": "Liter",
    "application_date": "2026-05-13T10:05:38.301Z",
    "notes": "Applied after pest detection"
  }
]
```

Frontend Notes

* Frontend should NOT ask users for financial_year. Backend automatically generates it from application_date.
* Update Pesticide API supports partial updates using PATCH request.
* Frontend should prevent duplicate submissions by disabling submit button during API request.
* Pesticide module tracks only pesticide usage history.
* Expense-related pesticide spending is handled separately in the Expense module.
* Search currently uses MongoDB regex search with:

  * case-insensitive matching
  * partial keyword matching


# Expense Service | Expense API

The Expense Service manages farmer financial expense records and farm-related accounting data.

Only users with the `farmer` role can access expense APIs.

The expense module is designed for:

* farm expense tracking
* crop-wise expense tracking
* yearly financial reporting
* farming cost analysis
* financial analytics

The expense module supports:

* Create Expense
* Get All Expenses
* Search Expenses
* Filter Expenses
* Get Expense By ID
* Update Expense
* Delete Expense

Financial year is automatically generated from the expense date.

Expense listing supports filtering by:

* farm
* crop
* financial year
* category
* search keyword

Search currently uses MongoDB regex search with:

* case-insensitive matching
* partial keyword matching

Duplicate expense records with the same:

* farm
* crop
* category
* item name
* quantity
* amount
* expense date (same day)

are restricted for the same user.

Protected APIs require a valid JWT token in the Authorization header.

Authorization Header Example

```txt id="expdoc1"
Authorization: Bearer <access_token>
```

Supported Expense Categories

```txt id="expdoc2"
fertilizer
pesticide
seeds
labor
diesel
transport
equipment
electricity
water
maintenance
other
```

Supported Payment Methods

```txt id="expdoc3"
cash
upi
bank_transfer
credit
other
```

Example Create Expense Request

POST /api/v1/expenses

```json id="expdoc4"
{
  "farm_id": "6a04d02f80c35afc502e850b",
  "crop_id": "6a04d514fb8c129225013400",
  "category": "pesticide",
  "item_name": "BVD",
  "quantity": 10,
  "unit": "Liter",
  "amount": 450,
  "payment_method": "cash",
  "expense_date": "2026-05-13T20:45:37.993Z",
  "notes": "Pesticide expense"
}
```

Example Get All Expenses Request

```txt id="expdoc5"
GET /api/v1/expenses
```

Example Search Expenses Request

```txt id="expdoc6"
GET /api/v1/expenses?search=bvd
```

Example Filter Expenses Request

```txt id="expdoc7"
GET /api/v1/expenses?financial_year=2026-2027&category=pesticide
```

Example Success Response

```json id="expdoc8"
[
  {
    "id": "6a04e31ff2d7e786956b9f72",
    "farm_id": "6a04d02f80c35afc502e850b",
    "crop_id": "6a04d514fb8c129225013400",
    "financial_year": "2026-2027",
    "category": "pesticide",
    "item_name": "BVD",
    "quantity": 10,
    "unit": "Liter",
    "amount": 450,
    "payment_method": "cash",
    "expense_date": "2026-05-13T20:45:37.993Z",
    "notes": "Pesticide expense"
  }
]
```

Frontend Notes

* Frontend should call GET /api/v1/farms to populate farm dropdown while creating expenses.
* Frontend should call GET /api/v1/crops to populate crop dropdown after farm selection.
* `farm_id` is mandatory for all expense records.
* `crop_id` is optional because some expenses may not belong to a specific crop.
* Frontend should NOT ask users for financial_year. Backend automatically generates it from expense_date.
* `quantity` and `unit` are optional because some expenses may not have measurable quantity.
* Update Expense API supports partial updates using PATCH request.
* Frontend should prevent duplicate submissions by disabling submit button during API request.
* Search currently uses MongoDB regex search with:

  * case-insensitive matching
  * partial keyword matching


# Profile Module Frontend Notes

## APIs

### Get User Profile

GET `/api/v1/users/me`

Response:

```json
{
  "id": "",
  "name": "",
  "phone": "",
  "role": ""
}
```

---

### Update Profile

PATCH `/api/v1/users/me`

Send ONLY changed fields.

Examples:

```json
{
  "name": "Balraje"
}
```

```json
{
  "phone": "9766863091"
}
```

```json
{
  "name": "Balraje",
  "phone": "9766863091"
}
```

Do NOT send:

```json
{
  "name": null
}
```

or empty fields.

---

### Change Password

PATCH `/api/v1/users/change-password`

Request:

```json
{
  "current_password": "",
  "new_password": ""
}
```

---

# UI Sections

## Profile Card

* user avatar
* name
* phone
* role

---

## Edit Profile Form

* name input
* phone input
* save changes button

Prefill inputs using `/users/me`.

---

## Change Password Form

* current password
* new password
* confirm password
* update password button

---

# Validation

## Phone

* 10 digits
* numeric only

## Password

* minimum 8 characters

---

# Important

Use PATCH properly:

* send only updated fields
* preserve old values automatically

---

# Responsive Design

No separate mobile API needed.

Use:

* flexbox
* css grid
* media queries

Keep same:

* sidebar
* navbar
* theme
* colors
* typography

Match existing app UI.



# Rental Module Frontend Notes

## Overview

Rental module allows users to:

### Farmer

* add equipment rental listings
* upload multiple equipment images
* view own rentals
* browse other rentals
* edit/delete rentals

### Merchant

* browse rental listings
* contact equipment owners

---

# Pages Required

## 1. Rental Marketplace Page

Route example:

```text id="m7q2v5"
/rentals
```

Purpose:

* browse rental listings

---

## 2. My Rentals Page

Route example:

```text id="x4v8m1"
/rentals/my-listings
```

Purpose:

* show current user's rentals

---

## 3. Create Rental Page

Route example:

```text id="p2m8q4"
/rentals/create
```

Purpose:

* create rental listing

---

## 4. Rental Details Page

Route example:

```text id="r5v1m8"
/rentals/:rentalId
```

Purpose:

* detailed rental view

---

# APIs

---

# Create Rental

## Endpoint

```http id="v9q2m5"
POST /api/v1/rentals
```

---

# Content Type

```text id="k8m3q1"
multipart/form-data
```

because:

* multiple image upload

---

# Required Fields

| Field            | Type           |
| ---------------- | -------------- |
| equipment_name   | string         |
| price_per_hour   | number         |
| price_per_day    | number         |
| village          | string         |
| taluka           | string         |
| district         | string         |
| state            | string         |
| owner_name       | string         |
| phone            | string         |
| description      | string         |
| equipment_images | multiple files |

---

# Price Validation

At least one required:

* price_per_hour
  OR
* price_per_day

---

# Multiple Image Upload

Use:

```html id="n4v8m2"
<input type="file" multiple />
```

---

# Append Images

```js id="f6m2q8"
files.forEach((file) => {
  formData.append("equipment_images", file)
})
```

---

# Rental Feed API

## Farmer Feed

Exclude own rentals:

```http id="c7v1m5"
GET /api/v1/rentals?exclude_my_listings=true
```

Use for:

* rental marketplace page

---

## Merchant Feed

Show all rentals:

```http id="u8q3m2"
GET /api/v1/rentals
```

---

# My Rentals API

```http id="y3m7q4"
GET /api/v1/rentals/my-listings
```

Shows:

* current user rentals only

---

# Rental Details API

```http id="e8v2m5"
GET /api/v1/rentals/{rental_id}
```

---

# Update Rental

```http id="p3q7m1"
PATCH /api/v1/rentals/{rental_id}
```

Content type:

```text id="t6m2q9"
multipart/form-data
```

because:

* image update supported

---

# Delete Rental

```http id="v1q8m3"
DELETE /api/v1/rentals/{rental_id}
```

---

# Rental Card UI

Each card should show:

* equipment image
* equipment name
* hourly price
* daily price
* village
* taluka
* district
* state
* owner name
* phone number
* availability status

---

# Rental Details Page

Show:

* image gallery slider
* equipment details
* pricing
* location
* owner info
* description
* availability

---

# Recommended UI Sections

# Rental Feed Page

Top section:

* search bar
* filters
* sort dropdown

---

# Search

Search API supports:

* equipment_name
* village
* taluka
* district
* state

Example:

```http id="k4m8q2"
GET /api/v1/rentals?search=tractor
```

---

# Filters

Recommended frontend filters:

* district
* state
* availability

---

# Sort Options

Frontend-side acceptable initially:

* latest
* oldest
* price low-high
* price high-low

---

# Create Rental Form Structure

## Section 1

Equipment Info

* equipment name
* hourly price
* daily price

---

## Section 2

Location

* village
* taluka
* district
* state

---

## Section 3

Owner Details

* owner name
* phone

---

## Section 4

Description

* textarea

---

## Section 5

Images

* multiple image upload
* image previews

---

# Important UX Rules

## Disable submit button during upload

Prevent duplicate submissions.

---

# Show Image Preview

Before submit:

* preview selected images

---

# Recommended Limits

## Max Images

```text id="j7v3m1"
5
```

## Max Size

```text id="h2q9m4"
5MB per image
```

---

# Error Handling

Duplicate listing response:

```json id="n5m1q8"
{
  "detail": "Similar equipment listing already exists"
}
```

Show:

* toast
* snackbar
* alert

---

# Responsive Design

Support:

* mobile
* tablet
* desktop

---

# Mobile Layout

Use stacked cards.

---

# Desktop Layout

Recommended:

```css id="z1v8m5"
grid-template-columns:
repeat(auto-fit, minmax(320px, 1fr));
```

---

# Recommended Rental Card Layout

Sections:

* image slider
* equipment info
* price
* location
* owner details
* action buttons

---

# Farmer Actions

Inside My Rentals:

```text id="r1v8m3"
Edit
Delete
View Details
```

---

# Merchant Actions

Inside Rental Feed:

```text id="f9q2m7"
Call Owner
View Details
```

---

# Important Frontend Logic

## Farmer Marketplace Feed

Call:

```js id="u5m2q8"
axios.get(
  "/api/v1/rentals?exclude_my_listings=true"
)
```

---

# Merchant Feed

Call:

```js id="d8q4m1"
axios.get(
  "/api/v1/rentals"
)
```

---

# My Rentals

Call:

```js id="r3m9q1"
axios.get(
  "/api/v1/rentals/my-listings"
)
```

---

# Important Backend Notes

Image field name must be:

```text id="y7v4m2"
equipment_images
```

NOT:

* images
* equipment_photo

---

# State Management Recommendation

```js id="j5m1q8"
rentals
selectedRental
images
search
filters
loading
```
