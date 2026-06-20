import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCurrentLocation } from "../utils/location";

const AppContext = createContext(null);

const LOCATION_KEY = "user_location";

export function AppProvider({ children }) {

  // ── Toasts ───────────────────────────────────────────────────────────────────
  // Same interface as web: pushToast(message, variant) / dismissToast(id)
  const [toasts, setToasts] = useState([]);

  const pushToast = useCallback((message, variant = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

//   const pushToast = useCallback(
//   (
//     message,
//     variant = "success"
//   ) => {

//     console.log(
//       "========== TOAST =========="
//     );

//     console.log(
//       "MESSAGE:",
//       message
//     );

//     console.trace(
//       "WHO CALLED TOAST"
//     );

//     const id =
//       Date.now() +
//       Math.random();

//     setToasts((prev) => [
//       ...prev,
//       {
//         id,
//         message,
//         variant,
//       },
//     ]);

//     setTimeout(() => {
//       setToasts((prev) =>
//         prev.filter(
//           (t) =>
//             t.id !== id
//         )
//       );
//     }, 3500);
//   },
//   []
  // );
  
  

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);


  // ── User location ────────────────────────────────────────────────────────────
  // Replaces: localStorage.getItem("user_location") → AsyncStorage
  // Non-sensitive data so AsyncStorage is fine (SecureStore for tokens only)
  const [userLocation, setUserLocationState] = useState(null);

  // Load cached location on startup
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(LOCATION_KEY);
        if (saved) setUserLocationState(JSON.parse(saved));
      } catch {
        // ignore
      }
    })();
  }, []);

  // Fetch fresh GPS location on startup (same as web)
  useEffect(() => {
    async function loadLocation() {
      try {
        const location = await getCurrentLocation();
        setUserLocationState(location);
        await AsyncStorage.setItem(LOCATION_KEY, JSON.stringify(location));
      } catch {
        // Location unavailable — use cached or null
      }
    }
    loadLocation();
  }, []);

  // Setter that also persists to AsyncStorage
  // Replaces: localStorage.setItem("user_location", JSON.stringify(location))
  const setUserLocation = useCallback(async (location) => {
    setUserLocationState(location);
    try {
      await AsyncStorage.setItem(LOCATION_KEY, JSON.stringify(location));
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo(() => ({
    toasts,
    pushToast,
    dismissToast,
    userLocation,
    setUserLocation,
  }), [toasts, pushToast, dismissToast, userLocation, setUserLocation]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
