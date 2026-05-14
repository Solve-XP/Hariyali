import "./SignUp.css";

import { useState } from "react";

import { useTranslation } from "react-i18next";

import {
  useNavigate,
  Link,
} from "react-router-dom";

import AuthShell from "../components/AuthShell";

import Input from "../components/Input";

import Button from "../components/Button";

import {
  signupUser,
} from "../services/authService";

import {
  useAuth,
} from "../context/AuthContext";

import {
  useApp,
} from "../context/AppContext";

export default function SignUp() {

  const { t } = useTranslation();

  const navigate = useNavigate();

  const { saveAuth } = useAuth();

  const { pushToast } = useApp();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    confirm: "",
    role: "farmer",
  });

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // Handle Input
  const set =
    (field) => (e) => {

      setForm((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  // Submit
  const handleSubmit =
    async (e) => {

      e.preventDefault();

      setError("");

      const {
        name,
        phone,
        password,
        confirm,
        role,
      } = form;

      // Empty Validation
      if (
        !name ||
        !phone ||
        !password ||
        !confirm
      ) {

        setError(
          "All fields are required"
        );

        return;
      }

      // Phone Validation
      if (
        !/^[0-9]{10}$/.test(phone)
      ) {

        setError(
          "Phone number must be exactly 10 digits"
        );

        return;
      }

      // Password Length
      if (
        password.length < 8
      ) {

        setError(
          "Password must be at least 8 characters"
        );

        return;
      }

      // Confirm Password
      if (
        password !== confirm
      ) {

        setError(
          "Passwords do not match"
        );

        return;
      }

      setLoading(true);

      try {

        // API Call
        const res =
          await signupUser({
            name: name.trim(),
            phone: phone.trim(),
            password,
            role: role.toLowerCase(),
          });

        console.log(
          "SIGNUP RESPONSE:",
          res
        );

        // Save Auth
        saveAuth(
          res.access_token,
          res.user
        );

        // Success Toast
        pushToast(
          "Signup successful",
          "success"
        );

        // Redirect
        switch (
          res.user.role
        ) {

          case "admin":

            navigate(
              "/admin/dashboard",
              {
                replace: true,
              }
            );

            break;

          case "farmer":

            navigate(
              "/farmer/dashboard",
              {
                replace: true,
              }
            );

            break;

          case "merchant":

            navigate(
              "/merchant/dashboard",
              {
                replace: true,
              }
            );

            break;

          default:

            navigate(
              "/login",
              {
                replace: true,
              }
            );
        }

      } catch (err) {

        console.log(
          "FULL ERROR:",
          err
        );

        console.log(
          "ERROR RESPONSE:",
          err.response
        );

        console.log(
          "ERROR DATA:",
          err.response?.data
        );

        // Backend Error Handling
        if (
          err?.response?.data?.detail
        ) {

          const detail =
            err.response.data.detail;

          if (
            Array.isArray(detail)
          ) {

            setError(
              detail
                .map(
                  (item) =>
                    item.msg
                )
                .join(", ")
            );

          } else {

            setError(detail);
          }

        } else if (
          err?.response?.data?.message
        ) {

          setError(
            err.response.data.message
          );

        } else {

          setError(
            "Something went wrong"
          );
        }

        pushToast(
          "Signup failed",
          "error"
        );

      } finally {

        setLoading(false);
      }
    };

  const footer = (

    <div className="auth-footer">

      Already have an account?{" "}

      <Link to="/login">
        Sign In
      </Link>

    </div>
  );

  return (

    <AuthShell
      title="Create your account"
      subtitle="Join SolveXP to manage your farm"
      footer={footer}
    >

      <form
        onSubmit={
          handleSubmit
        }
        className="
          auth-form
          signup-form
        "
      >

        {error && (

          <div className="auth-error">
            {error}
          </div>
        )}

        {/* Name */}

        <Input
          label="Full Name"
          type="text"
          value={form.name}
          onChange={set("name")}
          required
        />

        {/* Phone */}

        <Input
          label="Phone Number"
          type="tel"
          inputMode="numeric"
          value={form.phone}
          onChange={set("phone")}
          required
        />

        {/* Role */}

        <div className="role-group">

          <label className="role-group__label">
            Role
          </label>

          <div className="role-options">

            <label className="role-option">

              <input
                type="radio"
                name="role"
                value="farmer"
                checked={
                  form.role ===
                  "farmer"
                }
                onChange={set(
                  "role"
                )}
              />

              <span>
                Farmer
              </span>

            </label>

            <label className="role-option">

              <input
                type="radio"
                name="role"
                value="merchant"
                checked={
                  form.role ===
                  "merchant"
                }
                onChange={set(
                  "role"
                )}
              />

              <span>
                Merchant
              </span>

            </label>

          </div>

        </div>

        {/* Password Row */}

        <div className="
          signup-form__password-row
        ">

          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={set(
              "password"
            )}
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            value={form.confirm}
            onChange={set(
              "confirm"
            )}
            required
          />

        </div>

        {/* Button */}

        <Button
          type="submit"
          variant="primary"
          block
          disabled={loading}
        >

          {loading
            ? "Loading..."
            : "Sign Up"}

        </Button>

      </form>

    </AuthShell>
  );
}