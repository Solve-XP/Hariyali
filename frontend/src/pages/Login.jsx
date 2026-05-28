import "./Login.css";

import { useState } from "react";


import { useTranslation } from "react-i18next";

import {
  useNavigate,
  Link,
} from "react-router-dom";

import AuthShell from "../components/AuthShell";
import Input from "../components/Input";
import Button from "../components/Button";

import Marketplace
from "./marketplace/Marketplace";

import Rentals
from "./rentals/Rentals";

import { loginUser } from "../services/authService";

import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";

export default function Login() {

  const { t, i18n } = useTranslation();

  const navigate = useNavigate();

  const { saveAuth } = useAuth();

  const { pushToast } = useApp();

  const [phone, setPhone] = useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // Language Switch
  const switchLanguage = () => {

    i18n.changeLanguage(
      i18n.language === "en"
        ? "mr"
        : "en"
    );
  };

  // Login Submit
  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    // Validation
    if (!phone || !password) {

      setError(
        t("messages.VALIDATION_ERROR")
      );

      return;
    }

    setLoading(true);

    try {

      // API Call
      const res = await loginUser({
        phone,
        password,
      });

      console.log(res);

      // Save Token + User
      saveAuth(
        res.access_token,
        res.user
      );

      // Success Toast
      pushToast(
        t("messages.AUTH_LOGIN_SUCCESS"),
        "success"
      );

      // Role Based Redirect
      switch (res.user.role) {

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
            "/merchant/marketplace",
            {
              replace: true,
            }
          );

          break;

        default:

          navigate("/login", {
            replace: true,
          });
      }

    } catch (err) {

      console.log(err);

      const code =
        err?.response?.data?.message ||
        err?.message ||
        "GENERIC_ERROR";

      setError(

        t(`messages.${code}`, {

          defaultValue: t(
            "messages.GENERIC_ERROR"
          ),

        })
      );

      pushToast(
        t("messages.GENERIC_ERROR"),
        "error"
      );

    } finally {

      setLoading(false);
    }
  };

  const footer = (

    <div className="auth-footer">

      {t("auth.no_account")}{" "}

      <Link to="/signup">

        {t("auth.signup_link")}

      </Link>

    </div>
  );

  return (

    <>
      <div id="login">
        <AuthShell
          title={t("auth.login_title")}
          subtitle={t(
            "auth.login_subtitle"
          )}
          footer={footer}
        >

          <form
            onSubmit={handleSubmit}
            className="auth-form"
          >

            {error && (

              <div className="auth-error">

                {error}

              </div>
            )}

            {/* Phone */}

            <Input
              label={t("auth.phone")}
              type="tel"
              inputMode="tel"
              placeholder={t(
                "auth.phone_placeholder"
              )}
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              required
            />

            {/* Password */}

            <Input
              label={t("auth.password")}
              type="password"
              placeholder={t(
                "auth.password_placeholder"
              )}
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

            {/* Login Button */}

            <Button
              type="submit"
              variant="primary"
              block
              disabled={loading}
            >

              {loading
                ? t("common.loading")
                : t(
                    "auth.login_button"
                  )}

            </Button>

            {/* Language Switch */}

          { /*<Button
              type="button"
              variant="secondary"
              block
              onClick={switchLanguage}
            >

              {i18n.language === "en"
                ? "मराठी"
                : "English"}

            </Button>*/}

          </form>

        </AuthShell>

      </div>
    

    {/* <Marketplace />

      <Rentals /> */}
    </>
  );
}