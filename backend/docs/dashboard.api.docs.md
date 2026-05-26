# Dashboard Frontend Development API Docs

## Dashboard Goal

Build a modern responsive farm management dashboard using existing backend APIs.

Dashboard should support:

* desktop layout
* tablet layout
* mobile responsive layout
* financial overview
* recent activities
* marketplace preview
* quick statistics
* filter by financial year

---

# Base URL

```bash
http://127.0.0.1:8000/api/v1
```

---

# Authentication

All dashboard endpoints require JWT token.

## Headers

```js
Authorization: Bearer <token>
```

---

# 1. Dashboard Summary

## Endpoint

```http
GET /dashboard/summary?financial_year=2026-2027
```

## Purpose

Used for:

* top statistics cards
* overview KPIs

## Frontend Usage

### Dashboard Cards

* Total Income
* Total Expenses
* Net Profit
* Total Farms
* Total Crops
* Total Rentals
* Total Fertilizers
* Total Pesticides

## Example Response

```json
{
  "success": true,
  "data": {
    "total_income": 419182,
    "total_expenses": 99481,
    "net_profit": 319701,
    "total_farms": 4,
    "total_crops": 6,
    "total_rentals": 3,
    "total_fertilizers": 11,
    "total_pesticides": 5
  }
}
```

---

# 2. Financial Analytics

## Endpoint

```http
GET /dashboard/financial-analytics?financial_year=2026-2027
```

## Purpose

Used for:

* line charts
* income vs expense overview
* monthly analytics graph

## Frontend Usage

### Chart

* X-axis → months
* Y-axis → amount
* Income line
* Expense line
* Profit line

## Example Response

```json
{
  "success": true,
  "data": [
    {
      "month": "Jan",
      "income": 0,
      "expenses": 0,
      "profit": 0
    },
    {
      "month": "May",
      "income": 419182,
      "expenses": 99481,
      "profit": 319701
    }
  ]
}
```

---

# 3. Recent Incomes

## Endpoint

```http
GET /dashboard/recent-incomes
```

## Purpose

Used for:

* recent income table
* latest farm earnings

## Frontend Usage

### Table Columns

* Farm
* Crop
* Amount
* Date

## Example Response

```json
{
  "success": true,
  "data": [
    {
      "_id": "abc123",
      "farm_id": "farm1",
      "crop_id": "crop1",
      "amount": 58752,
      "financial_year": "2026-2027",
      "income_date": "2026-05-07 00:00:00"
    }
  ]
}
```

---

# 4. Recent Expenses

## Endpoint

```http
GET /dashboard/recent-expenses
```

## Purpose

Used for:

* expense activity table
* recent spending section

## Frontend Usage

### Table Columns

* Expense Name
* Category
* Amount
* Date

## Example Response

```json
{
  "success": true,
  "data": [
    {
      "_id": "exp123",
      "expense_name": "Seeds Buying",
      "category": "seeds",
      "amount": 5481,
      "expense_date": "2026-05-06 00:00:00"
    }
  ]
}
```

---

# 5. Recent Rentals

## Endpoint

```http
GET /dashboard/recent-rentals
```

## Purpose

Used for:

* equipment marketplace preview
* latest equipment listings

## Frontend Usage

### Marketplace Cards

* Equipment image
* Equipment name
* Hourly rate
* Daily rate
* Location

## Example Response

```json
{
  "success": true,
  "data": [
    {
      "_id": "rent123",
      "equipment_name": "Robo Spray",
      "price_per_hour": 200,
      "price_per_day": 500,
      "location": "Pune",
      "equipment_photo": "image-url"
    }
  ]
}
```

---

# 6. Expense Breakdown

## Endpoint

```http
GET /dashboard/expense-breakdown?financial_year=2026-2027
```

## Purpose

Used for:

* pie chart
* doughnut chart
* expense category analytics

## Frontend Usage

### Breakdown Categories

* seeds
* fertilizer
* pesticide
* diesel
* labor
* transport

## Example Response

```json
{
  "success": true,
  "data": [
    {
      "category": "seeds",
      "total": 5481
    },
    {
      "category": "diesel",
      "total": 85500
    }
  ]
}
```

---

# 7. Income Breakdown

## Endpoint

```http
GET /dashboard/income-breakdown?financial_year=2026-2027
```

## Purpose

Used for:

* crop-wise income chart
* revenue distribution

## Frontend Usage

### Chart

* pie chart
* crop profitability chart

## Example Response

```json
{
  "success": true,
  "data": [
    {
      "crop_name": "Corn",
      "total": 58752
    },
    {
      "crop_name": "Sugarcane",
      "total": 200000
    }
  ]
}
```

---

# 8. Filter Options

## Endpoint

```http
GET /dashboard/filter-options
```

## Purpose

Used for:

* financial year dropdown
* filters

## Frontend Usage

### Dropdowns

* financial year selector

## Example Response

```json
{
  "success": true,
  "data": {
    "financial_years": [
      "2023-2024",
      "2024-2025",
      "2025-2026",
      "2026-2027"
    ],
    "expense_categories": [
      "fertilizer",
      "pesticide",
      "seeds",
      "labor",
      "diesel"
    ]
  }
}
```

---

# Recommended Dashboard Sections

## Top Area

* Greeting
* Date
* Notification icon
* Language switcher

---

## KPI Cards Row

* Total Farms
* Total Income
* Total Expenses
* Total Crops
* Equipment Listings

---

## Main Analytics Section

Left:

* financial overview chart

Right:

* top farms
* quick actions

---

## Activity Section

* recent incomes table
* recent expenses table

---

## Marketplace Section

* rental equipment cards

---

## Bottom Stats

* fertilizers count
* pesticides count
* connected farms
* total land
* active listings

---

# Frontend Recommendations

## Recommended Stack

* React
* React Router
* Axios
* Recharts
* Normal CSS or CSS Modules

---

# Recommended Charts

## Use Recharts

### Financial Analytics

```js
LineChart
```

### Expense Breakdown

```js
PieChart
```

### Income Breakdown

```js
PieChart
```

---

# Responsive Design Rules

## Desktop

* sidebar expanded
* multi-column layout

## Tablet

* smaller cards
* 2-column sections

## Mobile

* sidebar drawer
* stacked cards
* horizontal chart scroll if needed

---

# Recommended Component Structure

```bash
components/dashboard/
├── SummaryCards.jsx
├── FinancialChart.jsx
├── ExpenseBreakdown.jsx
├── IncomeBreakdown.jsx
├── RecentIncomeTable.jsx
├── RecentExpenseTable.jsx
├── RentalCards.jsx
├── QuickActions.jsx
├── FilterBar.jsx
```

---

# Important Backend Notes

## Financial Year Filter Applies To

* incomes
* expenses
* crops
* fertilizers
* pesticides

## Financial Year Filter Does NOT Apply To

* farms
* rentals

because they are lifetime entities.

---

# Recommended Frontend Flow

## Page Load

Call:

```js
Promise.all([
  getSummary(),
  getFinancialAnalytics(),
  getRecentIncomes(),
  getRecentExpenses(),
  getRecentRentals(),
  getExpenseBreakdown(),
  getIncomeBreakdown(),
  getFilterOptions()
])
```

---

# Suggested UI Style

Keep same:

* sidebar
* navbar
* typography
* green theme

Dashboard should feel like continuation of existing pages.

Do NOT create completely different design system.
