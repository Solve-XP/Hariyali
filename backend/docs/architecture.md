```text
backend/
│
├── app/
│   ├── main.py                 # FastAPI application entry point
│   ├── lifespan.py             # Startup/shutdown events (DB, indexes)
│
│   ├── api/
│   │   ├── dependencies/
│   │   │   └── auth.py         # Auth dependencies (JWT, current user)
│   │   │
│   │   └── v1/
│   │       ├── router.py       # Combine all API routers
│   │       │
│   │       └── endpoints/
│   │           ├── auth.py         # Login/register APIs
│   │           ├── farms.py        # Farm CRUD APIs
│   │           ├── crops.py        # Crop management APIs
│   │           ├── transactions.py # Income/expense transaction APIs
│   │           ├── equipment.py    # Equipment management APIs
│   │           ├── dashboard.py    # Dashboard analytics APIs
│   │           └── users.py        # User/profile APIs
│
│   ├── core/
│   │   ├── config.py           # Environment & app configuration
│   │   ├── security.py         # JWT & password security logic
│   │   ├── constants.py        # Reusable constants
│   │   └── exceptions.py       # Custom exception classes
│
│   ├── services/
│   │   ├── auth_service.py         # Authentication business logic
│   │   ├── farm_service.py         # Farm business logic
│   │   ├── crop_service.py         # Crop business logic
│   │   ├── transaction_service.py  # Financial transaction logic
│   │   ├── equipment_service.py    # Equipment business logic
│   │   ├── dashboard_service.py    # Dashboard calculations & analytics
│   │   └── s3_service.py           # AWS S3 file upload logic
│
│   ├── repositories/
│   │   ├── base_repo.py         # Common reusable DB operations
│   │   ├── farm_repo.py         # Farm database queries
│   │   ├── crop_repo.py         # Crop database queries
│   │   ├── transaction_repo.py  # Transaction database queries
│   │   ├── equipment_repo.py    # Equipment database queries
│   │   └── user_repo.py         # User database queries
│
│   ├── schemas/
│   │   ├── auth.py             # Auth request/response schemas
│   │   ├── farm.py             # Farm schemas
│   │   ├── crop.py             # Crop schemas
│   │   ├── transaction.py      # Transaction schemas
│   │   ├── equipment.py        # Equipment schemas
│   │   ├── dashboard.py        # Dashboard response schemas
│   │   └── common.py           # Common reusable schemas
│
│   ├── db/
│   │   ├── database.py         # MongoDB connection setup
│   │   ├── indexes.py          # MongoDB indexes
│   │   └── seed.py             # Initial seed data
│
│   ├── middleware/
│   │   ├── auth_middleware.py     # Request authentication middleware
│   │   ├── logging_middleware.py  # API request/response logging
│   │   └── error_handler.py       # Global exception handling
│
│   ├── integrations/
│   │   └── s3.py               # AWS S3 integration setup
│
│   ├── utils/
│   │   ├── validators.py       # Custom validators
│   │   ├── pagination.py       # Pagination utilities
│   │   ├── search.py           # Search/filter helpers
│   │   └── financial_year.py   # Financial year utility logic
│
├── scripts/
│   ├── create_indexes.py       # Script to create DB indexes
│   └── migrate.py              # Database migration scripts
│
├── .env                        # Environment variables
├── requirements.txt            # Python dependencies
├── Dockerfile                  # Docker backend setup
├── docker-compose.yml          # Multi-container Docker setup
└── README.md                   # Project documentation
```
# High-Level Backend Explanation

* app/ → Main backend application source code

* api/ → Handles API requests and responses

* endpoints/ → Feature-wise API routes (farms, crops, transactions, etc.)

* dependencies/ → Shared dependencies like JWT auth and current user validation

* core/ → Central configuration, security, constants, and exception handling

* services/ → Contains business logic and application workflows

* repositories/ → Responsible for communicating with MongoDB database

* schemas/ → Pydantic models for request validation and response formatting

* db/ → Database connection, indexes, and seed setup

* middleware/ → Runs before/after requests for logging, auth, and error handling

* integrations/ → Third-party service integrations like AWS S3

* utils/ → Common reusable helper functions and utilities

* scripts/ → Standalone setup and migration scripts

* .env → Environment variables and secrets

* requirements.txt → Python package dependencies

* Dockerfile → Docker backend container setup

* docker-compose.yml → Runs backend and database services together

* README.md → Project setup and documentation

---

# Backend Flow

```text id="cbb9sk"
Frontend
   ↓
API Layer
   ↓
Service Layer
   ↓
Repository Layer
   ↓
MongoDB
```

---

# Architecture

Layered Modular Monolith Architecture using:

* FastAPI
* MongoDB
* Repository Pattern
* Service Layer Pattern
* JWT Authentication
* Docker
