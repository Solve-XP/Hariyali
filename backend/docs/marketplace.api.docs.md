# Marketplace Service | Marketplace API

The Marketplace Service manages crop listings created by farmers for selling agricultural produce.

Only authenticated farmers can create, update, and delete marketplace listings.

The marketplace module is designed for:

* Crop listing management
* Farmer-to-merchant crop discovery
* Agricultural marketplace browsing
* Crop sales lead generation

The marketplace is a listing-based system.

The backend currently supports:

* Crop listing creation
* Crop browsing
* Search functionality
* Listing management
* Farmer-owned listing management

The module does NOT currently support:

* Online ordering
* Payment gateway
* Shopping cart
* Real-time bidding
* Chat system
* Delivery tracking

The Marketplace module supports:

* Create Listing
* Get All Listings
* Search Listings
* Get Listing By ID
* Get My Listings
* Update Listing
* Delete Listing

Crop images are stored in AWS S3 using Presigned URL uploads.

Search currently uses MongoDB regex search with:

* Case-insensitive matching
* Partial keyword matching

Protected APIs require a valid JWT token in the Authorization header.

## Authorization Header Example

Authorization: Bearer <access_token>

---

# Crop Image Upload Flow

Crop images are uploaded directly from the frontend to AWS S3 using Presigned URLs.

The backend does not receive image files.

Upload flow:

1. User selects crop images
2. Frontend requests Presigned URLs
3. Backend generates AWS S3 Presigned URLs
4. Frontend uploads images directly to S3
5. Frontend receives image URLs
6. Frontend sends marketplace data with image URLs
7. Backend stores image URLs in MongoDB

Benefits:

* Reduced backend load
* Faster uploads
* Better scalability
* Lower server bandwidth usage
* Production-ready architecture

---

# Step 1: Generate Presigned URLs

POST /api/v1/uploads/presigned-urls

Request:

```json
{
  "folder": "marketplace",
  "content_types": [
    "image/webp",
    "image/webp"
  ]
}
```

Response:

```json
{
  "uploads": [
    {
      "upload_url": "https://...",
      "file_url": "https://...",
      "file_key": "marketplace/image1.webp"
    },
    {
      "upload_url": "https://...",
      "file_url": "https://...",
      "file_key": "marketplace/image2.webp"
    }
  ]
}
```

---

# Step 2: Upload Images To S3

PUT <upload_url>

Content-Type: image/webp

Body: Binary image file

Response:

```text
200 OK
```

---

# Step 3: Create Marketplace Listing

POST /api/v1/marketplace/listings

Content-Type: application/json

```json
{
  "farm_id": "6a22ba3d29d4ba9e118e8bcf",
  "farm_name": "Balraje Farm",
  "crop_id": "6a22ba3d29d4ba9e118e8bd0",
  "crop_name": "Sugarcane",
  "quantity": 500,
  "unit": "kg",
  "expected_price": 25000,
  "harvest_date": "2026-07-15",
  "village": "Goradwadi",
  "taluka": "Karveer",
  "district": "Kolhapur",
  "state": "Maharashtra",
  "latitude": 16.705,
  "longitude": 74.243,
  "description": "Fresh sugarcane crop available",
  "crop_images": [
    "https://farm-management-images.s3.ap-south-1.amazonaws.com/marketplace/image1.webp",
    "https://farm-management-images.s3.ap-south-1.amazonaws.com/marketplace/image2.webp"
  ]
}
```

---

# Get All Listings

## Farmer Marketplace Feed

Exclude current user's listings:

```http
GET /api/v1/marketplace/listings?exclude_my_listings=true
```

---

## Merchant Marketplace Feed

Show all listings:

```http
GET /api/v1/marketplace/listings
```

---

# Search Listings

Example:

```http
GET /api/v1/marketplace/listings?search=sugarcane
```

Search supports:

* Crop name
* Farm name
* Village
* Taluka
* District
* State

Search uses:

* Case-insensitive matching
* Partial keyword matching

---

# Public Listings

```http
GET /api/v1/marketplace/public/listings
```

Example:

```http
GET /api/v1/marketplace/public/listings?search=sugarcane
```

---

# My Listings

```http
GET /api/v1/marketplace/my-listings
```

Returns listings created by the authenticated farmer.

---

# Get Listing By ID

```http
GET /api/v1/marketplace/listings/{listing_id}
```

Returns complete listing details.

---

# Update Listing

```http
PATCH /api/v1/marketplace/listings/{listing_id}
```

Content-Type: application/json

Example:

```json
{
  "quantity": 700,
  "expected_price": 30000,
  "description": "Updated crop details"
}
```

Update API supports partial updates.

Only supplied fields are updated.

Image updates are currently not supported.

---

# Delete Listing

```http
DELETE /api/v1/marketplace/listings/{listing_id}
```

Performs a soft delete of the listing.

---

# Example Success Response

```json
{
  "message": "Listing created successfully",
  "listing_id": "6a295f168bac062a7b6b7ff6"
}
```

---

# Example Listing Response

```json
{
  "id": "6a295f168bac062a7b6b7ff6",
  "farm_name": "Balraje Farm",
  "crop_name": "Sugarcane",
  "quantity": 500,
  "unit": "kg",
  "expected_price": 25000,
  "harvest_date": "2026-07-15",
  "village": "Goradwadi",
  "taluka": "Karveer",
  "district": "Kolhapur",
  "state": "Maharashtra",
  "owner_name": "Balraje",
  "crop_images": [
    "https://farm-management-images.s3.ap-south-1.amazonaws.com/marketplace/image1.webp",
    "https://farm-management-images.s3.ap-south-1.amazonaws.com/marketplace/image2.webp"
  ],
  "description": "Fresh sugarcane crop available"
}
```

---

# Frontend Notes

* Crop image upload is mandatory while creating a listing.
* Multiple crop images are supported.
* Images must be uploaded using Presigned URLs before creating the listing.
* Frontend should submit JSON payloads to Marketplace APIs.
* Backend never receives image files.
* Backend only stores image URLs.
* Farm name and crop name should be selected from dropdowns.
* Users should never manually enter IDs.
* Frontend should display image previews before upload.
* Submit button should be disabled during API requests.
* Recommended maximum image count is 5.
* Recommended maximum image size is 5 MB per image.
* Marketplace Feed and My Listings should remain separate pages.

---

# Final Architecture

Frontend

↓

Upload Service (Presigned URLs)

↓

AWS S3 Direct Upload

↓

Marketplace API

↓

MongoDB (Stores Image URLs Only)
