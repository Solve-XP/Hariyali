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

----------------------------------------------------------------------------------

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

----------------------------------------------------------------------------------


# Fertilizer Service | Fertilizer API

The Fertilizer Service manages fertilizer records associated with farmer-owned crops and farms.

Only users with the `farmer` role can access fertilizer APIs.

The fertilizer module supports:

* Create Fertilizer
* Get All Fertilizers
* Search Fertilizers
* Filter Fertilizers
* Get Fertilizer By ID
* Update Fertilizer
* Delete Fertilizer

Fertilizer listing supports filtering by:

* farm
* crop
* search keyword

Search currently uses MongoDB regex search with:

* case-insensitive matching
* partial keyword matching

Protected APIs require a valid JWT token in the Authorization header.

Authorization Header Example

Authorization: Bearer <access_token>

Example Create Fertilizer Request

POST /api/v1/fertilizers

```json
{
  "farm_id": "6819e7c2c8f24f6c0c4f1234",
  "crop_id": "6820e7c2c8f24f6c0c4f5678",
  "fertilizer_name": "Urea",
  "quantity": 10,
  "unit": "bag",
  "cost": 1000,
  "application_date": "2026-05-13T10:05:38.301Z",
  "notes": "Applied before irrigation"
}
```

Example Get All Fertilizers Request

GET /api/v1/fertilizers

Example Search Fertilizers Request

GET /api/v1/fertilizers?search=urea

Example Filter Fertilizers Request

GET /api/v1/fertilizers?farm_id=6819e7c2c8f24f6c0c4f1234

GET /api/v1/fertilizers?crop_id=6820e7c2c8f24f6c0c4f5678

Example Success Response

```json
[
  {
    "id": "6a044f24418234e51c4ecca5",
    "farm_id": "6819e7c2c8f24f6c0c4f1234",
    "crop_id": "6820e7c2c8f24f6c0c4f5678",
    "fertilizer_name": "Urea",
    "quantity": 10,
    "unit": "bag",
    "cost": 1000,
    "application_date": "2026-05-13T10:05:38.301Z",
    "notes": "Applied before irrigation"
  }
]
```

Frontend Notes

* Frontend should call GET /api/v1/farms to populate the farm dropdown while creating fertilizers.
* Frontend should call GET /api/v1/crops?farm_id=<farm_id> to populate crop dropdown based on selected farm.
* Farmers should not manually enter farm_id or crop_id. Frontend should automatically send selected IDs.
* Fertilizer list currently returns farm_id and crop_id. Frontend should map IDs with farm_name and crop_name using farms and crops API responses.
* Update Fertilizer API supports partial updates using PATCH request.
* Search currently uses MongoDB regex search with:

  * case-insensitive matching
  * partial keyword matching


----------------------------------------------------------------------------------

# Pesticide Service | Pesticide API

The Pesticide Service manages pesticide records associated with farmer-owned crops and farms.

Only users with the `farmer` role can access pesticide APIs.

The pesticide module supports:

* Create Pesticide
* Get All Pesticides
* Search Pesticides
* Filter Pesticides
* Get Pesticide By ID
* Update Pesticide
* Delete Pesticide

Pesticide listing supports filtering by:

* farm
* crop
* search keyword

Search currently uses MongoDB regex search with:

* case-insensitive matching
* partial keyword matching

Protected APIs require a valid JWT token in the Authorization header.

Authorization Header Example

Authorization: Bearer <access_token>

Example Create Pesticide Request

POST /api/v1/pesticides

```json id="r9sff0"
{
  "farm_id": "6819e7c2c8f24f6c0c4f1234",
  "crop_id": "6820e7c2c8f24f6c0c4f5678",
  "pesticide_name": "Insecticide X",
  "quantity": 5,
  "unit": "liter",
  "cost": 2500,
  "application_date": "2026-05-13T10:05:38.301Z",
  "notes": "Applied after pest detection"
}
```

Example Get All Pesticides Request

GET /api/v1/pesticides

Example Search Pesticides Request

GET /api/v1/pesticides?search=insect

Example Filter Pesticides Request

GET /api/v1/pesticides?farm_id=6819e7c2c8f24f6c0c4f1234

GET /api/v1/pesticides?crop_id=6820e7c2c8f24f6c0c4f5678

Example Success Response

```json id="bvl11i"
[
  {
    "id": "6a044f24418234e51c4ecca5",
    "farm_id": "6819e7c2c8f24f6c0c4f1234",
    "crop_id": "6820e7c2c8f24f6c0c4f5678",
    "pesticide_name": "Insecticide X",
    "quantity": 5,
    "unit": "liter",
    "cost": 2500,
    "application_date": "2026-05-13T10:05:38.301Z",
    "notes": "Applied after pest detection"
  }
]
```

Frontend Notes

* Frontend should call GET /api/v1/farms to populate the farm dropdown while creating pesticides.
* Frontend should call GET /api/v1/crops?farm_id=<farm_id> to populate crop dropdown based on selected farm.
* Farmers should not manually enter farm_id or crop_id. Frontend should automatically send selected IDs.
* Pesticide list currently returns farm_id and crop_id. Frontend should map IDs with farm_name and crop_name using farms and crops API responses.
* Update Pesticide API supports partial updates using PATCH request.
* Search currently uses MongoDB regex search with:

  * case-insensitive matching
  * partial keyword matching


----------------------------------------------------------------------------------

# Income Service | Income API

The Income Service manages crop harvest income records and farming revenue tracking.

Only users with the `farmer` role can access income APIs.

The income module is designed for:

* crop harvest income tracking
* yearly farming revenue analysis
* crop-wise income tracking
* farm profitability analysis
* financial analytics

The income module tracks income generated ONLY from crops.

The income module supports:

* Create Income
* Get All Incomes
* Search Incomes
* Filter Incomes
* Get Income By ID
* Update Income
* Delete Income

Financial year is automatically generated from the income date.

Income listing supports filtering by:

* farm
* crop
* financial year
* search keyword

Search currently uses MongoDB regex search with:

* case-insensitive matching
* partial keyword matching

Duplicate income records with the same:

* farm
* crop
* harvest quantity
* amount
* income date (same day)

are restricted for the same user.

Protected APIs require a valid JWT token in the Authorization header.

Authorization Header Example

```txt
Authorization: Bearer <access_token>
```

Example Create Income Request

POST /api/v1/incomes

```json
{
  "farm_id": "6a04d02f80c35afc502e850b",
  "crop_id": "6a04d514fb8c129225013400",
  "harvest_quantity": 100,
  "unit": "Quintal",
  "amount": 250000,
  "income_date": "2026-11-10T10:00:00.000Z",
  "notes": "Cotton harvest sale"
}
```

Example Get All Incomes Request

```txt
GET /api/v1/incomes
```

Example Search Incomes Request

```txt
GET /api/v1/incomes?search=quintal
```

Example Filter Incomes Request

```txt
GET /api/v1/incomes?financial_year=2026-2027
```

Example Success Response

```json
[
  {
    "id": "6a05a92df2d7e786956b9f91",
    "farm_id": "6a04d02f80c35afc502e850b",
    "crop_id": "6a04d514fb8c129225013400",
    "financial_year": "2026-2027",
    "harvest_quantity": 100,
    "unit": "Quintal",
    "amount": 250000,
    "income_date": "2026-11-10T10:00:00.000Z",
    "notes": "Cotton harvest sale"
  }
]
```

Frontend Notes

* Frontend should call GET /api/v1/farms to populate farm dropdown while creating incomes.
* Frontend should call GET /api/v1/crops to populate crop dropdown after farm selection.
* `farm_id` is mandatory for all income records.
* `crop_id` is mandatory because income is generated only from crops.
* Frontend should NOT ask users for financial_year. Backend automatically generates it from income_date.
* `harvest_quantity` represents harvested or sold crop quantity.
* Update Income API supports partial updates using PATCH request.
* Frontend should prevent duplicate submissions by disabling submit button during API request.
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



# Rental Marketplace Service | Rental Marketplace API

The Rental Marketplace Service manages farm equipment rental listings shared by farmers.

Only authenticated users can create, update, and delete rental listings.

The rental marketplace module is designed for:

equipment rental listing
farmer-to-farmer equipment sharing
equipment discovery
local rental marketplace browsing

The rental marketplace is a listing-based system.

The backend currently supports:

equipment listing creation
equipment browsing
search functionality
equipment availability management

The module does NOT currently support:

online booking
payment gateway
live availability calendar
chat system
rental contracts

The rental marketplace module supports:

Create Equipment Listing
Get All Listings
Search Listings
Filter Listings
Get Listing By ID
Update Listing
Delete Listing

Financial year is automatically generated while creating the listing.

Equipment photos are uploaded and stored in AWS S3.

Rental listing supports filtering by:

financial year
search keyword

Search currently uses MongoDB regex search with:

case-insensitive matching
partial keyword matching

Duplicate listings with the same:

equipment name
location
same user
same day

are restricted.

Protected APIs require a valid JWT token in the Authorization header.

Authorization Header Example

Authorization: Bearer <access_token>

Rental Pricing Logic

At least one pricing field is required:

price_per_hour
price_per_day

Both can also be provided.

Example Create Rental Listing Request

POST /api/v1/rentals

Content-Type: multipart/form-data

equipment_name = Tractor

price_per_hour = 500

price_per_day = 3500

location = Kolhapur

owner_name = Balraje

phone = 9766863091

description = Heavy duty tractor available for farming work

equipment_photo = tractor.jpg

Example Get All Rental Listings Request

GET /api/v1/rentals

Example Search Rental Listings Request

GET /api/v1/rentals?search=tractor

Example Filter Rental Listings Request

GET /api/v1/rentals?financial_year=2026-2027

Example Success Response

[
  {
    "id": "6a05a2cb3186e144bf1d5867",
    "financial_year": "2026-2027",
    "equipment_name": "Tractor",
    "price_per_hour": 500,
    "price_per_day": 3500,
    "location": "Kolhapur",
    "owner_name": "Balraje",
    "phone": "9766863091",
    "equipment_photo": "https://bucket-name.s3.region.amazonaws.com/rentals/image.jpg",
    "description": "Heavy duty tractor available",
    "is_available": true
  }
]

Frontend Notes

Equipment photo upload is mandatory while creating listing.
Equipment photo upload is optional while updating listing.
Frontend should use multipart/form-data for create and update APIs.
Frontend should allow user to provide either:
hourly pricing
daily pricing
or both
Frontend should show equipment image preview before upload.
Frontend should prevent duplicate submissions by disabling submit button during API request.
Update Listing API supports partial updates using PATCH request.
Backend ignores fields not provided during update requests.
Search currently uses MongoDB regex search with:
case-insensitive matching
partial keyword matching

