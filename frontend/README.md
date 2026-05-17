# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



## Project Structure

```bash
frontend/
├── public/
│   ├── favicon.svg
│   └── icons.svg
│
├── src/
│   ├── api/
│   │   └── axios.js
│   │
│   ├── components/
│   │   ├── AuthShell.css
│   │   ├── AuthShell.jsx
│   │   ├── Badge.css
│   │   ├── Badge.jsx
│   │   ├── Button.css
│   │   ├── Button.jsx
│   │   ├── Card.css
│   │   ├── Card.jsx
│   │   ├── ConfirmDialog.css
│   │   ├── ConfirmDialog.jsx
│   │   ├── EmptyState.css
│   │   ├── EmptyState.jsx
│   │   ├── Icons.jsx
│   │   ├── ImageViewer.css
│   │   ├── ImageViewer.jsx
│   │   ├── Input.css
│   │   ├── Input.jsx
│   │   ├── Modal.css
│   │   ├── Modal.jsx
│   │   ├── PageHeader.css
│   │   ├── PageHeader.jsx
│   │   ├── SearchInput.css
│   │   ├── SearchInput.jsx
│   │   ├── Select.css
│   │   ├── Select.jsx
│   │   ├── Sidebar.css
│   │   ├── Sidebar.jsx
│   │   ├── StatCard.css
│   │   ├── StatCard.jsx
│   │   ├── StatsCard.jsx
│   │   ├── Table.css
│   │   ├── Table.jsx
│   │   ├── ToastStack.css
│   │   ├── ToastStack.jsx
│   │   ├── Topbar.css
│   │   └── Topbar.jsx
│   │
│   ├── context/
│   │   ├── AppContext.jsx
│   │   └── AuthContext.jsx
│   │
│   ├── i18n/
│   │   ├── en.json
│   │   ├── i18n.js
│   │   └── mr.json
│   │
│   ├── layouts/
│   │   ├── MainLayout.css
│   │   └── MainLayout.jsx
│   │
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── Dashboard.css
│   │   │   └── Dashboard.jsx
│   │   │
│   │   ├── farmer/
│   │   │   ├── Dashboard.css
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Farms.css
│   │   │   └── Farms.jsx
│   │   │
│   │   ├── merchant/
│   │   │   ├── Dashboard.css
│   │   │   └── Dashboard.jsx
│   │   │
│   │   ├── Login.css
│   │   ├── Login.jsx
│   │   ├── Signup.css
│   │   └── Signup.jsx
│   │
│   ├── routes/
│   │   ├── AdminRoutes.jsx
│   │   ├── AppRoutes.jsx
│   │   ├── FarmerRoutes.jsx
│   │   ├── MerchantRoutes.jsx
│   │   └── ProtectedRoute.jsx
│   │
│   ├── services/
│   │   ├── authService.js
│   │   └── farmsService.js
│   │
│   ├── styles/
│   │   └── global.css
│   │
│   ├── utils/
│   │   ├── errorHandler.js
│   │   ├── formData.js
│   │   └── validators.js
│   │
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .gitignore
├── index.html
├── package-lock.json
├── package.json
├── README.md
└── vite.config.js
```
