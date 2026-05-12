/**
 * API service layer
 */

const BASE_URL = "http://localhost:8000/api/v1";


function getToken() {
  return localStorage.getItem("fm_token");
}


async function request(
  method,
  path,
  body,
  requiresAuth = true
) {

  const headers = {
    "Content-Type": "application/json"
  };

  if (requiresAuth) {

    const token = getToken();

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const res = await fetch(
    `${BASE_URL}${path}`,
    {
      method,
      headers,
      body:
        body != null
          ? JSON.stringify(body)
          : undefined,
    }
  );

  const data = await res.json()
    .catch(() => ({}));

  if (!res.ok) {

    let message = "GENERIC_ERROR";

    if (typeof data.detail === "string") {
      message = data.detail;
    }

    else if (Array.isArray(data.detail)) {
      message =
        data.detail[0]?.msg || message;
    }

    throw new Error(message);
  }

  return data;
}


const get = (
  path,
  auth = true
) => request(
  "GET",
  path,
  null,
  auth
);


const post = (
  path,
  body,
  auth = true
) => request(
  "POST",
  path,
  body,
  auth
);


const del = (
  path,
  auth = true
) => request(
  "DELETE",
  path,
  null,
  auth
);


// ── AUTH ─────────────────────────────

export const AuthAPI = {

  signup: (body) =>
    post("/auth/signup", body, false),

  login: (body) =>
    post("/auth/login", body, false),

  adminLogin: (body) =>
    post("/auth/admin-login", body, false),
};


// ── USERS ────────────────────────────

export const UsersService = {

  list: () =>
    get("/users"),
};