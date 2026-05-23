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

/* =========================================================
   LOAD FROM LOCAL STORAGE
========================================================= */

function load(key, fallback = null) {

  try {

    return (
      JSON.parse(
        localStorage.getItem(key)
      ) ?? fallback
    );

  } catch {

    return fallback;
  }
}

/* =========================================================
   PROVIDER
========================================================= */

export function AuthProvider({ children }) {

  /* =====================================================
     TOKEN
  ====================================================== */

  const [token, setToken] = useState(

    () =>
      localStorage.getItem(
        TOKEN_KEY
      ) || null

  );

  /* =====================================================
     USER
  ====================================================== */

  const [user, setUser] = useState(

    () => load(USER_KEY)

  );

  /* =====================================================
     SAVE AUTH
  ====================================================== */

  const saveAuth = useCallback(

    (token, user) => {

      localStorage.setItem(
        TOKEN_KEY,
        token
      );

      localStorage.setItem(
        USER_KEY,
        JSON.stringify(user)
      );

      setToken(token);

      setUser(user);
    },

    []

  );

  /* =====================================================
     UPDATE USER
  ====================================================== */

  const updateUser = useCallback(

    (updatedData) => {

      const updatedUser = {
        ...user,
        ...updatedData,
      };

      setUser(updatedUser);

      localStorage.setItem(
        USER_KEY,
        JSON.stringify(updatedUser)
      );
    },

    [user]

  );

  /* =====================================================
     LOGOUT
  ====================================================== */

  const logout = useCallback(() => {

    localStorage.removeItem(
      TOKEN_KEY
    );

    localStorage.removeItem(
      USER_KEY
    );

    setToken(null);

    setUser(null);

  }, []);

  /* =====================================================
     ROLE CHECKS
  ====================================================== */

  const isAuthenticated =
    Boolean(token);

  const isAdmin =
    user?.role === "admin";

  const isFarmer =
    user?.role === "farmer";

  const isMerchant =
    user?.role === "merchant";

  /* =====================================================
     CONTEXT VALUE
  ====================================================== */

  const value = useMemo(

    () => ({

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

    }),

    [

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

    ]

  );

  /* =====================================================
     PROVIDER
  ====================================================== */

  return (

    <AuthContext.Provider
      value={value}
    >

      {children}

    </AuthContext.Provider>

  );
}

/* =========================================================
   HOOK
========================================================= */

export function useAuth() {

  const ctx =
    useContext(AuthContext);

  if (!ctx) {

    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return ctx;
}