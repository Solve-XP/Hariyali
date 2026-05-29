import { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";


import {
  getCurrentLocation
} from "../utils/location";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [
    userLocation,
    setUserLocation
  ] = useState(() => {

    const saved =
      localStorage.getItem(
        "user_location"
      );

    return saved
      ? JSON.parse(saved)
      : null;
  });

  const pushToast = useCallback((message, variant = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const dismissToast = useCallback(
    (id) => setToasts((prev) => prev.filter((t) => t.id !== id)),
    [],
  );

  useEffect(() => {

    async function loadLocation() {

      try {

        const location =
          await getCurrentLocation();

        setUserLocation(
          location
        );

        localStorage.setItem(

          "user_location",

          JSON.stringify(
            location
          )
        );

      } catch {

        console.log(
          "Location unavailable"
        );
      }
    }

    loadLocation();

  }, []);

  // const value = useMemo(
  //   () => ({ toasts, pushToast, dismissToast }),
  //   [toasts, pushToast, dismissToast],
  // );

  const value = useMemo(
    () => ({

      toasts,

      pushToast,

      dismissToast,

      userLocation,

      setUserLocation,

    }),

    [

      toasts,

      pushToast,

      dismissToast,

      userLocation,

    ]
  );
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
