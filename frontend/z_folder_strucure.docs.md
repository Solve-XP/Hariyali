project-root/
├── public/
│   ├── favicon.svg
│   ├── icons.svg
│   └── images/
│       ├── farmer-mobile - Copy.jpeg
│       ├── farmer-mobile-edit.jpeg
│       └── farmer-mobile.png
│
└── src/
    ├── App.jsx
    ├── index.css
    ├── main.jsx
    │
    ├── api/
    │   └── axios.js
    │
    ├── assets/
    │   ├── farm-bg.jpg
    │   └── farmer-mobile.jpg.jpeg
    │
    ├── components/
    │   ├── AuthShell.css
    │   ├── AuthShell.jsx
    │   ├── Badge.css
    │   ├── Badge.jsx
    │   ├── Button.css
    │   ├── Button.jsx
    │   ├── Card.css
    │   ├── Card.jsx
    │   ├── ConfirmDialog.css
    │   ├── ConfirmDialog.jsx
    │   ├── ContactActions.css
    │   ├── ContactActions.jsx
    │   ├── EmptyState.css
    │   ├── EmptyState.jsx
    │   ├── Footer.css
    │   ├── Footer.jsx
    │   ├── Icons.jsx
    │   ├── ImageCarousel.css
    │   ├── ImageCarousel.jsx
    │   ├── ImageViewer.css
    │   ├── ImageViewer.jsx
    │   ├── Input.css
    │   ├── Input.jsx
    │   ├── LocationBadge.css
    │   ├── LocationBadge.jsx
    │   ├── MapPickerModal.css
    │   ├── MapPickerModal.jsx
    │   ├── Modal.css
    │   ├── Modal.jsx
    │   ├── PageHeader.css
    │   ├── PageHeader.jsx
    │   ├── SearchInput.css
    │   ├── SearchInput.jsx
    │   ├── Select.css
    │   ├── Select.jsx
    │   ├── Sidebar.css
    │   ├── Sidebar.jsx
    │   ├── StatCard.css
    │   ├── StatCard.jsx
    │   ├── StatsCard.jsx
    │   ├── Table.css
    │   ├── Table.jsx
    │   ├── ToastStack.css
    │   ├── ToastStack.jsx
    │   ├── Topbar.css
    │   ├── Topbar.jsx
    │   │
    │   ├── marketplace/
    │   │   ├── ListingCard.css
    │   │   ├── ListingCard.jsx
    │   │   ├── ListingEmptyState.jsx
    │   │   ├── ListingFilters.css
    │   │   ├── ListingFilters.jsx
    │   │   ├── ListingForm.css
    │   │   ├── ListingForm.jsx
    │   │   ├── ListingGrid.css
    │   │   ├── ListingGrid.jsx
    │   │   ├── ListingImageSlider.css
    │   │   ├── ListingImageSlider.jsx
    │   │   ├── ListingSellerInfo.css
    │   │   ├── ListingSellerInfo.jsx
    │   │   ├── ListingSkeleton.css
    │   │   ├── ListingSkeleton.jsx
    │   │   ├── MarketplaceCard.css
    │   │   ├── MarketplaceCard.jsx
    │   │   ├── MarketplaceTabs.css
    │   │   └── MarketplaceTabs.jsx
    │   │
    │   └── rentals/
    │       ├── RentalCard.css
    │       ├── RentalCard.jsx
    │       ├── RentalForm.css
    │       └── RentalForm.jsx
    │
    ├── context/
    │   ├── AppContext.jsx
    │   └── AuthContext.jsx
    │
    ├── data/
    │   └── usefulLinks.js
    │
    ├── i18n/
    │   ├── en.json
    │   ├── hi.json
    │   ├── i18n.js
    │   └── mr.json
    │
    ├── layouts/
    │   ├── MainLayout.css
    │   └── MainLayout.jsx
    │
    ├── pages/
    │   ├── Login.css
    │   ├── Login.jsx
    │   ├── Signup.css
    │   ├── Signup.jsx
    │   │
    │   ├── admin/
    │   │   ├── Dashboard.css
    │   │   └── Dashboard.jsx
    │   │
    │   ├── farmer/
    │   │   ├── Crops.css
    │   │   ├── Crops.jsx
    │   │   ├── Dashboard.css
    │   │   ├── Dashboard.jsx
    │   │   ├── Expenses.css
    │   │   ├── Expenses.jsx
    │   │   ├── Farms.css
    │   │   ├── Farms.jsx
    │   │   ├── Fertilizers.css
    │   │   ├── Fertilizers.jsx
    │   │   ├── Incomes.css
    │   │   ├── Incomes.jsx
    │   │   ├── Pesticides.css
    │   │   ├── Pesticides.jsx
    │   │   ├── Rentals.css
    │   │   └── Rentals.jsx
    │   │
    │   ├── marketplace/
    │   │   ├── CreateListing.css
    │   │   ├── CreateListing.jsx
    │   │   ├── EditListing.jsx
    │   │   ├── ListingDetails.jsx
    │   │   ├── Marketplace.css
    │   │   ├── Marketplace.jsx
    │   │   ├── MyListings.css
    │   │   └── MyListings.jsx
    │   │
    │   ├── merchant/
    │   │   ├── Dashboard.css
    │   │   └── Dashboard.jsx
    │   │
    │   ├── profile/
    │   │   ├── Profile.css
    │   │   └── Profile.jsx
    │   │
    │   ├── rentals/
    │   │   ├── CreateRental.jsx
    │   │   ├── EditRental.jsx
    │   │   ├── MyRentals.jsx
    │   │   ├── Rental.css
    │   │   ├── RentalDetails.jsx
    │   │   └── Rentals.jsx
    │   │
    │   └── static/
    │       ├── Contact.jsx
    │       ├── PrivacyPolicy.jsx
    │       ├── StaticPages.css
    │       ├── Support.jsx
    │       ├── Terms.jsx
    │       ├── UsefulLinks.css
    │       └── UsefulLinks.jsx
    │
    ├── routes/
    │   ├── AdminRoutes.jsx
    │   ├── AppRoutes.jsx
    │   ├── FarmerRoutes.jsx
    │   ├── MerchantRoutes.jsx
    │   └── ProtectedRoute.jsx
    │
    ├── services/
    │   ├── authService.js
    │   ├── cropsService.js
    │   ├── dashboardService.js
    │   ├── expensesService.js
    │   ├── farmsService.js
    │   ├── fertilizersService.js
    │   ├── incomesService.js
    │   ├── marketplaceService.js
    │   ├── pesticidesService.js
    │   ├── rentalsService.js
    │   └── usersService.js
    │
    ├── styles/
    │   └── global.css
    │
    └── utils/
        ├── errorHandler.js
        ├── formData.js
        ├── geocoding.js
        ├── location.js
        └── validators.js