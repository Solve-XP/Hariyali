// // src/components/ContactActions.jsx

// import "./ContactActions.css";

// import Button from "./Button";

// export default function ContactActions({

//   phone,

//   className = "",
// }) {

//   const handleCall = (e) => {

//     e.stopPropagation();

//     window.open(
//       `tel:${phone}`,
//       "_self"
//     );
//   };

//   const handleWhatsApp = (e) => {

//     e.stopPropagation();

//     const cleanPhone =
//       String(phone).replace(/\D/g, "");

//     window.open(
//       `https://wa.me/91${cleanPhone}`,
//       "_blank"
//     );
//   };

//   return (

//     <div className={`
//       contact-actions
//       ${className}
//     `}>

//       <Button
//         variant="secondary"
//         className="contact-btn contact-btn--call"
//         onClick={handleCall}
//       >
//         Call
//       </Button>

//       <Button
//         variant="success"
//         className="contact-btn contact-btn--whatsapp"
//         onClick={handleWhatsApp}
//       >
//         WhatsApp
//       </Button>

//     </div>
//   );
// }

// src/components/ContactActions.jsx

import "./ContactActions.css";

import { useTranslation } from "react-i18next";

import Button from "./Button";

export default function ContactActions({

  phone,

  className = "",
}) {

  const { t } =
    useTranslation();

  const handleCall = (e) => {

    e.stopPropagation();

    window.open(
      `tel:${phone}`,
      "_self"
    );
  };

  const handleWhatsApp = (e) => {

    e.stopPropagation();

    const cleanPhone =
      String(phone).replace(/\D/g, "");

    window.open(
      `https://wa.me/91${cleanPhone}`,
      "_blank"
    );
  };

  return (

    <div className={`
      contact-actions
      ${className}
    `}>

      <Button
        variant="secondary"
        className="contact-btn contact-btn--call"
        onClick={handleCall}
      >
        {t("contact.call")}
      </Button>

      <Button
        variant="success"
        className="contact-btn contact-btn--whatsapp"
        onClick={handleWhatsApp}
      >
        {t("contact.whatsapp")}
      </Button>

    </div>
  );
}