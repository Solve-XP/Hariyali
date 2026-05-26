# Marketplace Module Frontend Notes

## Overview

Marketplace module allows:

### Farmer

* create marketplace listing
* upload multiple crop images
* view own listings
* browse other farmers listings
* edit/delete own listings

### Merchant

* browse all farmer listings
* contact farmers

---

# Pages Required

## 1. Marketplace Feed Page

Route example:

```text id="m7q2v5"
/marketplace
```

Purpose:

* show marketplace listings
* browsing page for farmers and merchants

---

## 2. My Listings Page

Route example:

```text id="x4v8m1"
/marketplace/my-listings
```

Purpose:

* current farmer listings only

---

## 3. Create Listing Page

Route example:

```text id="p2m8q4"
/marketplace/create
```

Purpose:

* farmer creates listing

---

## 4. Listing Details Page

Route example:

```text id="r5v1m8"
/marketplace/:listingId
```

Purpose:

* detailed crop view
* image gallery
* seller details

---

# APIs

---

# Create Listing

## Endpoint

```http id="v9q2m5"
POST /api/v1/marketplace/listings
```

## Content Type

```text id="k8m3q1"
multipart/form-data
```

because:

* multiple image upload

---

# Required Fields

| Field          | Type           |
| -------------- | -------------- |
| farm_id        | string         |
| farm_name      | string         |
| crop_id        | string         |
| crop_name      | string         |
| quantity       | number         |
| unit           | string         |
| expected_price | number         |
| harvest_date   | YYYY-MM-DD     |
| village        | string         |
| taluka         | string         |
| district       | string         |
| state          | string         |
| description    | string         |
| crop_images    | multiple files |

---

# Important Frontend Logic

User should NOT manually type:

* farm name
* crop name

Use dropdowns.

---

# Farm Dropdown

Frontend should fetch farmer farms.

User selects farm.

Store internally:

```js id="n4v8m2"
selectedFarm.id
selectedFarm.farm_name
```

---

# Crop Dropdown

Frontend should fetch crops.

User selects crop.

Store internally:

```js id="f6m2q8"
selectedCrop.id
selectedCrop.crop_name
```

---

# Then Send Automatically

```js id="c7v1m5"
formData.append("farm_id", selectedFarm.id)
formData.append("farm_name", selectedFarm.farm_name)

formData.append("crop_id", selectedCrop.id)
formData.append("crop_name", selectedCrop.crop_name)
```

User never sees IDs.

---

# Multiple Image Upload

Use:

```html id="u8q3m2"
<input type="file" multiple />
```

---

# Append Images

```js id="y3m7q4"
files.forEach((file) => {
  formData.append("crop_images", file)
})
```

---

# Harvest Date

Use:

```html id="e8v2m5"
<input type="date" />
```

Backend expects:

```text id="p3q7m1"
YYYY-MM-DD
```

---

# Marketplace Feed API

## Farmer Feed

Exclude own listings:

```http id="t6m2q9"
GET /api/v1/marketplace/listings?exclude_my_listings=true
```

Use this for:

* farmer marketplace page

---

## Merchant Feed

Show all listings:

```http id="v1q8m3"
GET /api/v1/marketplace/listings
```

Use this for:

* merchant marketplace page

---

# My Listings API

```http id="k4m8q2"
GET /api/v1/marketplace/my-listings
```

Shows:

* only current farmer listings

---

# Listing Details API

```http id="j7v3m1"
GET /api/v1/marketplace/listings/{listing_id}
```

---

# Delete Listing

```http id="h2q9m4"
DELETE /api/v1/marketplace/listings/{listing_id}
```

---

# Update Listing

```http id="n5m1q8"
PATCH /api/v1/marketplace/listings/{listing_id}
```

Send only updated fields.

---

# Listing Card UI

Each card should show:

* crop image
* crop name
* farm name
* quantity + unit
* expected price
* harvest date
* village
* taluka
* district
* state
* seller name

---

# Merchant Card Actions

Show:

```text id="r1v8m3"
Call Farmer
View Details
```

---

# Farmer Card Actions

In My Listings:

```text id="f9q2m7"
Edit
Delete
View Details
```

---

# Recommended UI Sections

# Marketplace Feed

Top section:

* search input
* filter bar
* sort dropdown

---

# Search

Search API supports:

* crop name
* farm name
* village
* taluka
* district
* state

Example:

```http id="z1v8m5"
GET /api/v1/marketplace/listings?search=corn
```

---

# Filters

Recommended frontend filters:

* state
* district
* taluka

Client-side initially acceptable.

---

# Sort Options

Frontend-only initially acceptable:

* latest listings
* oldest listings
* price low-high
* price high-low

---

# Create Listing Form Structure

## Section 1

Farm & Crop

* farm dropdown
* crop dropdown

---

## Section 2

Crop Details

* quantity
* unit
* expected price
* harvest date

---

## Section 3

Location

* village
* taluka
* district
* state

---

## Section 4

Description

* multiline textarea

---

## Section 5

Images

* multiple image upload
* image previews

---

# Important UX Rules

## Disable submit button while loading

Prevent duplicate submissions.

Example:

```js id="u5m2q8"
if (loading) return
```

---

## Show Upload Preview

Before submit:

* preview selected images

---

## Limit Image Count

Recommended:

* max 5 images

---

## Limit Image Size

Recommended:

* max 5MB per image

---

# Error Handling

Backend duplicate response:

```json id="d8q4m1"
{
  "detail": "Similar marketplace listing already exists"
}
```

Show as:

* toast
* snackbar
* alert

---

# Responsive Design

Must support:

* mobile
* tablet
* desktop

---

# Mobile Layout Recommendation

Cards stacked vertically.

---

# Desktop Layout Recommendation

Use responsive grid:

```css id="r3m9q1"
grid-template-columns:
repeat(auto-fit, minmax(320px, 1fr));
```

---

# UI Style

Keep same:

* navbar
* sidebar
* theme
* typography
* spacing
* card style

as existing dashboard system.

---

# Recommended Card Design

Card sections:

* image slider
* crop details
* location
* seller info
* action buttons

---

# Important Backend Notes

Do NOT manually type:

* farm_name
* crop_name

Always auto-fill from selected dropdown option.

---

# Recommended Frontend State

```js id="y7v4m2"
selectedFarm
selectedCrop
images
loading
listings
filters
search
```

---

# Final Important Note

Farmer marketplace feed and My Listings are DIFFERENT pages.

Do not merge them into one screen.

Use:

```text id="j5m1q8"
Marketplace
My Listings
```

as separate sidebar menu items.
