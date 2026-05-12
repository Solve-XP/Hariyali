import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

import "./i18n/i18n";
import "./index.css";

import { AuthProvider } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <AppProvider>
        <App />
      </AppProvider>
    </AuthProvider>
  </React.StrictMode>
);