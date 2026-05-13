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
