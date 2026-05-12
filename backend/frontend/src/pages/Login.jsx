import { useState } from "react";

import { useTranslation } from "react-i18next";

import { loginUser } from "../services/authService";


function Login() {

  const { t, i18n } = useTranslation();

  const [phone, setPhone] = useState("");

  const [password, setPassword] = useState("");


  const changeLanguage = (lang) => {

    i18n.changeLanguage(lang);

    localStorage.setItem(
      "solvexp_lang",
      lang
    );
  };


  const handleLogin = async () => {

    try {

      const response = await loginUser({
        phone,
        password,
      });

      localStorage.setItem(
        "token",
        response.access_token
      );

      alert(
        t("messages.AUTH_LOGIN_SUCCESS")
      );

      console.log(response);

    } catch (error) {

      console.log(error);

      alert(
        t("messages.AUTH_INVALID_CREDENTIALS")
      );
    }
  };


  return (

    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
      }}
    >

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px",
          marginBottom: "20px",
        }}
      >

        <button
          onClick={() => changeLanguage("en")}
        >
          EN
        </button>

        <button
          onClick={() => changeLanguage("mr")}
        >
          मराठी
        </button>

      </div>


      <h1>
        {t("auth.login_title")}
      </h1>

      <p>
        {t("auth.login_subtitle")}
      </p>


      <div
        style={{
          marginTop: "20px",
        }}
      >

        <label>
          {t("auth.phone")}
        </label>

        <input
          type="text"
          placeholder={t("auth.phone_placeholder")}
          value={phone}
          onChange={(e) =>
            setPhone(e.target.value)
          }
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "5px",
            marginBottom: "15px",
          }}
        />


        <label>
          {t("auth.password")}
        </label>

        <input
          type="password"
          placeholder={t("auth.password_placeholder")}
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "5px",
            marginBottom: "20px",
          }}
        />


        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "12px",
            cursor: "pointer",
          }}
        >
          {t("auth.login_button")}
        </button>

      </div>

    </div>
  );
}

export default Login;