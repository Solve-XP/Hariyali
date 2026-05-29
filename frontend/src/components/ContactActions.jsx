

import "./ContactActions.css";

import {
  useTranslation,
} from "react-i18next";

import {
  useNavigate,
} from "react-router-dom";

import Button
from "./Button";

import {
  useAuth,
} from "../context/AuthContext";

import {
  useApp,
} from "../context/AppContext";

export default function ContactActions({

  phone,

  latitude,

  longitude,

  className = "",

  isLocked = false,

}) {

  const { t } =
    useTranslation();

  const navigate =
    useNavigate();

  const {
    pushToast,
  } = useApp();

  const {
    isAuthenticated,
  } = useAuth();

  /* =====================================
     LOGIN GUARD
  ===================================== */

  const handleProtectedAction =
    (
      actionType =
        "details"
    ) => {

      if (
        !isAuthenticated ||
        isLocked
      ) {

        let actionMessage =
          t(
            "authMessages.loginToCall"
          );

        switch (
          actionType
        ) {

          case "call":

            actionMessage =
              t(
                "authMessages.loginToCall"
              );

            break;

          case "whatsapp":

            actionMessage =
              t(
                "authMessages.loginToWhatsapp"
              );

            break;

          case "directions":

            actionMessage =
              t(
                "authMessages.loginToDirections"
              );

            break;

          case "details":

            actionMessage =
              t(
                "authMessages.loginToViewDetails"
              );

            break;

          default:

            actionMessage =
              "Login required";
        }

        pushToast(
          actionMessage,
          "error"
        );

        navigate(
          "/login"
        );

        return false;
      }

      return true;
    };

  /* =====================================
     CALL
  ===================================== */

  const handleCall =
    (e) => {

      e.stopPropagation();

      const allowed =
        handleProtectedAction(
          "call"
        );

      if (
        !allowed
      ) return;

      window.open(
        `tel:${phone}`,
        "_self"
      );
    };

  /* =====================================
     WHATSAPP
  ===================================== */

  const handleWhatsApp =
    (e) => {

      e.stopPropagation();

      const allowed =
        handleProtectedAction(
          "whatsapp"
        );

      if (
        !allowed
      ) return;

      const cleanPhone =
        String(phone)
          .replace(
            /\D/g,
            ""
          );

      window.open(
        `https://wa.me/91${cleanPhone}`,
        "_blank"
      );
    };

  /* =====================================
     DIRECTIONS
  ===================================== */

  const handleDirections =
    (e) => {

      e.stopPropagation();

      const allowed =
        handleProtectedAction(
          "directions"
        );

      if (
        !allowed
      ) return;

      if (

        !latitude ||

        !longitude

      ) {

        pushToast(

          t(
            "contact.locationUnavailable"
          ),

          "error"
        );

        return;
      }

      window.open(

        `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,

        "_blank"
      );
    };

  return (

    <div
      className={`
        contact-actions
        ${className}
      `}
    >

      <Button
        variant="secondary"
        className="
          contact-btn
          contact-btn--call
        "
        onClick={
          handleCall
        }
      >
        {t(
          "contact.call"
        )}
      </Button>

      
      <Button
        variant="accent"
        className="
          contact-btn
          contact-btn--directions
        "
        onClick={
          handleDirections
        }
      >
        {t(
          "contact.directions"
        )}
      </Button>

      <Button
        variant="success"
        className="
          contact-btn
          contact-btn--whatsapp
        "
        onClick={
          handleWhatsApp
        }
      >
        {t(
          "contact.whatsapp"
        )}
      </Button>


    </div>
  );
}