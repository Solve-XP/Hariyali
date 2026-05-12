import "./SignUp.css";

import { useState } from "react";

import { useTranslation }
from "react-i18next";

import {
  useNavigate,
  Link,
} from "react-router-dom";

import AuthShell
from "../components/AuthShell";

import Input
from "../components/Input";

import Button
from "../components/Button";

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

  const { t } =
    useTranslation();

  const navigate =
    useNavigate();

  const { saveAuth } =
    useAuth();

  const { pushToast } =
    useApp();

  const [form, setForm] =
    useState({

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

        [field]:
          e.target.value,

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

      // Validation
      if (
        !name ||
        !phone ||
        !password ||
        !confirm
      ) {

        setError(
          t(
            "messages.VALIDATION_ERROR"
          )
        );

        return;
      }

      if (
        password.length < 6
      ) {

        setError(
          t(
            "auth.password_too_short"
          )
        );

        return;
      }

      if (
        password !== confirm
      ) {

        setError(
          t(
            "auth.password_mismatch"
          )
        );

        return;
      }

      setLoading(true);

      try {

        // API Call
        const res =
          await signupUser({

            name,

            phone,

            password,

            role,

          });

        console.log(res);

        // Save Auth
        saveAuth(
          res.access_token,
          res.user
        );

        // Success Toast
        pushToast(
          t(
            "messages.AUTH_SIGNUP_SUCCESS"
          ),
          "success"
        );

        // Role Redirect
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

        console.log(err);

        const code =

          err?.response?.data
            ?.message ||

          err?.message ||

          "GENERIC_ERROR";

        setError(

          t(
            `messages.${code}`,

            {

              defaultValue:
                t(
                  "messages.GENERIC_ERROR"
                ),

            }
          )
        );

        pushToast(
          t(
            "messages.GENERIC_ERROR"
          ),
          "error"
        );

      } finally {

        setLoading(false);
      }
    };

  const footer = (

    <div className="auth-footer">

      {t(
        "auth.have_account"
      )}{" "}

      <Link to="/login">

        {t(
          "auth.login_link"
        )}

      </Link>

    </div>
  );

  return (

    <AuthShell

      title={t(
        "auth.signup_title"
      )}

      subtitle={t(
        "auth.signup_subtitle"
      )}

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
          label={t(
            "auth.name"
          )}
          type="text"
          placeholder={t(
            "auth.name_placeholder"
          )}
          value={form.name}
          onChange={set(
            "name"
          )}
          required
        />

        {/* Phone */}

        <Input
          label={t(
            "auth.phone"
          )}
          type="tel"
          inputMode="tel"
          placeholder={t(
            "auth.phone_placeholder"
          )}
          value={form.phone}
          onChange={set(
            "phone"
          )}
          required
        />

        {/* Role Radio */}

        <div className="role-group">

          <label className="role-group__label">

            {t("auth.role")}

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

        {/* Passwords */}

        <div className="
          signup-form__password-row
        ">

          <Input
            label={t(
              "auth.password"
            )}
            type="password"
            placeholder={t(
              "auth.password_placeholder"
            )}
            value={form.password}
            onChange={set(
              "password"
            )}
            required
          />

          <Input
            label={t(
              "auth.confirm_password"
            )}
            type="password"
            placeholder={t(
              "auth.password_placeholder"
            )}
            value={form.confirm}
            onChange={set(
              "confirm"
            )}
            required
          />

        </div>

        {/* Signup Button */}

        <Button
          type="submit"
          variant="primary"
          block
          disabled={loading}
        >

          {loading

            ? t(
                "common.loading"
              )

            : t(
                "auth.signup_button"
              )}

        </Button>

      </form>

    </AuthShell>
  );
}