import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import { AppState } from "react-native";
import * as SecureStore from "expo-secure-store";

const AuthContext = createContext(null);

const TOKEN_KEY = "fm_token";
const USER_KEY  = "fm_user";

// ─── AUTO LOGOUT TIME ─────────────────────────────────────────────────────────
// Same 15 min as web — but uses AppState (background/foreground) instead of
// mouse/keyboard events which don't exist on mobile
const IDLE_TIMEOUT = 15 * 60 * 1000;

// ─── LOAD FROM SECURESTORE ────────────────────────────────────────────────────
// Replaces web's localStorage.getItem + JSON.parse
async function loadSecure(key, fallback = null) {
  try {
    const raw = await SecureStore.getItemAsync(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function AuthProvider({ children }) {

  const [token, setToken] = useState(null);
  const [user,  setUser]  = useState(null);
  const [ready, setReady] = useState(false); // true once SecureStore is read

  const timeoutRef      = useRef(null);
  const bgTimestampRef  = useRef(null); // when app went to background

  // ── Restore session on app start ────────────────────────────────────────────
  // Replaces: useState(() => localStorage.getItem(TOKEN_KEY))
  useEffect(() => {
    (async () => {
      const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
      const storedUser  = await loadSecure(USER_KEY);
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
      }
      setReady(true);
    })();
  }, []);

  // ── Save auth (called after login) ──────────────────────────────────────────
  // Replaces: localStorage.setItem(TOKEN_KEY, token)
  const saveAuth = useCallback(async (newToken, newUser) => {
    await SecureStore.setItemAsync(TOKEN_KEY, newToken);
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }, []);

  // ── Update user (after profile edit) ────────────────────────────────────────
  // Replaces: localStorage.setItem(USER_KEY, JSON.stringify(updatedUser))
  const updateUser = useCallback(async (updatedData) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedData };
      SecureStore.setItemAsync(USER_KEY, JSON.stringify(merged));
      return merged;
    });
  }, []);

  // ── Logout ───────────────────────────────────────────────────────────────────
  // Replaces: localStorage.removeItem + window.location.href = "/login"
  // Navigation is handled by AppNavigator watching isAuthenticated
  const logout = useCallback(async () => {
    clearTimeout(timeoutRef.current);
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  // ── Auto logout on idle ──────────────────────────────────────────────────────
  // Web used mouse/keyboard events. Mobile uses AppState (background detection).
  // Logic: if app is backgrounded and comes back after IDLE_TIMEOUT → logout.
  useEffect(() => {
    if (!token) return;

    // Start the idle timer when logged in
    const startTimer = () => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        logout();
      }, IDLE_TIMEOUT);
    };

    startTimer();

    // AppState listener: background → foreground
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "background" || nextState === "inactive") {
        // Record when we went to background
        bgTimestampRef.current = Date.now();
        clearTimeout(timeoutRef.current);
      } else if (nextState === "active") {
        // Check how long we were in the background
        if (bgTimestampRef.current) {
          const elapsed = Date.now() - bgTimestampRef.current;
          if (elapsed >= IDLE_TIMEOUT) {
            logout();
            return;
          }
        }
        // Resume timer for remaining time
        startTimer();
      }
    });

    return () => {
      clearTimeout(timeoutRef.current);
      subscription.remove();
    };
  }, [token, logout]);

  // ── Role checks ──────────────────────────────────────────────────────────────
  const isAuthenticated = Boolean(token);
  const isAdmin         = user?.role === "admin";
  const isFarmer        = user?.role === "farmer";
  const isMerchant      = user?.role === "merchant";

  const value = useMemo(() => ({
    token,
    user,
    setUser,
    updateUser,
    isAuthenticated,
    isAdmin,
    isFarmer,
    isMerchant,
    saveAuth,
    logout,
    ready,
  }), [token, user, setUser, updateUser, isAuthenticated, isAdmin, isFarmer, isMerchant, saveAuth, logout, ready]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
