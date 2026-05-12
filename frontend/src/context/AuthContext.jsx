import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";

const AuthContext = createContext(null);

const TOKEN_KEY = "fm_token";
const USER_KEY = "fm_user";

function load(key, fallback = null) {

  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

export function AuthProvider({ children }) {

  const [token, setToken] = useState(
    () => localStorage.getItem(TOKEN_KEY) || null
  );

  const [user, setUser] = useState(
    () => load(USER_KEY)
  );

  // Save login data
  const saveAuth = useCallback((token, user) => {

    localStorage.setItem(TOKEN_KEY, token);

    localStorage.setItem(
      USER_KEY,
      JSON.stringify(user)
    );

    setToken(token);
    setUser(user);

  }, []);

  // Logout
  const logout = useCallback(() => {

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    setToken(null);
    setUser(null);

  }, []);

  // Role checks
  const isAuthenticated = Boolean(token);

  const isAdmin = user?.role === "admin";

  const isFarmer = user?.role === "farmer";

  const isMerchant = user?.role === "merchant";

  const value = useMemo(
    () => ({
      token,
      user,

      isAuthenticated,

      isAdmin,
      isFarmer,
      isMerchant,

      saveAuth,
      logout,
    }),
    [
      token,
      user,

      isAuthenticated,

      isAdmin,
      isFarmer,
      isMerchant,

      saveAuth,
      logout,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {

  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return ctx;
}