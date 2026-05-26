import {
  BrowserRouter,
} from "react-router-dom";

import AppRoutes
from "./routes/AppRoutes";

import ToastStack
from "./components/ToastStack";

function App() {

  return (

    <BrowserRouter>

      <AppRoutes />

      {/* GLOBAL TOAST */}

      <ToastStack />

    </BrowserRouter>
  );
}

export default App;