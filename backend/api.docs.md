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

Financial year is automatically generated from the fertilizer application date.

Fertilizer listing supports filtering by:

* farm
* crop
* financial year
* search keyword

Search currently uses MongoDB regex search with:

* case-insensitive matching
* partial keyword matching

Protected APIs require a valid JWT token in the Authorization header.

Authorization Header Example

Authorization: Bearer <access_token>

Example Create Fertilizer Request

POST /api/v1/fertilizers

```json id="q8r9ny"
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

GET /api/v1/fertilizers?financial_year=2026-2027

Example Success Response

```json id="bfbdyv"
[
  {
    "id": "6a044f24418234e51c4ecca5",
    "farm_id": "6819e7c2c8f24f6c0c4f1234",
    "crop_id": "6820e7c2c8f24f6c0c4f5678",
    "financial_year": "2026-2027",
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
* Financial year is automatically generated from application_date.
* Update Fertilizer API supports partial updates using PATCH request.
* Search currently uses MongoDB regex search with:

  * case-insensitive matching
  * partial keyword matching

---

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

Financial year is automatically generated from the pesticide application date.

Pesticide listing supports filtering by:

* farm
* crop
* financial year
* search keyword

Search currently uses MongoDB regex search with:

* case-insensitive matching
* partial keyword matching

Protected APIs require a valid JWT token in the Authorization header.

Authorization Header Example

Authorization: Bearer <access_token>

Example Create Pesticide Request

POST /api/v1/pesticides

```json id="4rf6gh"
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

GET /api/v1/pesticides?financial_year=2026-2027

Example Success Response

```json id="9t2yt5"
[
  {
    "id": "6a044f24418234e51c4ecca5",
    "farm_id": "6819e7c2c8f24f6c0c4f1234",
    "crop_id": "6820e7c2c8f24f6c0c4f5678",
    "financial_year": "2026-2027",
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
* Financial year is automatically generated from application_date.
* Update Pesticide API supports partial updates using PATCH request.
* Search currently uses MongoDB regex search with:

  * case-insensitive matching
  * partial keyword matching
