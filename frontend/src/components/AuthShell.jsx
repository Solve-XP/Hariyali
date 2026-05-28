
// import "./AuthShell.css";

// import { useTranslation } from "react-i18next";

// import { SUPPORTED_LANGUAGES } from "../i18n/i18n";

// import farmBg from "../assets/farm-bg.jpg";

// import { ShieldCheck } from "lucide-react";


// import {
//   Sprout,
//   Users,
//   Droplets,
//   BarChart3,
// } from "lucide-react";

// export default function AuthShell({
//   title,
//   subtitle,
//   children,
//   footer,
// }) {

//   const { t, i18n } =
//     useTranslation();

//   return (

//   //   <div
//   //    className="auth-shell"
//   // style={{
//   //   backgroundImage: `url(${farmBg})`,
//   //   backgroundPosition: "top",
//   //   backgroundSize: "cover",
//   //   backgroundRepeat: "no-repeat",
//   // }}

//   <div className="auth-shell">
//   <img src={farmBg} alt="Farm Background" className="auth-bg-image" />

//       {/* Overlay */}

//       <div className="auth-shell__overlay"></div>

//       {/* Left Side */}

//       <div className="auth-shell__hero">


//         <div className="auth-shell__brand">

//           <div className="auth-shell__logo">
//             FM
//           </div>

//           <div className="auth-shell__brand-text">

//             <h2>
//               {t("app.name")}
//             </h2>

//             <p>
//               Farmer Management
//               System
//             </p>

//           </div>

//         </div>

//          {/* <img
//     src={farmerImage}
//     alt="Farmer"
//     className="auth-shell__hero-image"
//   /> */}


//         <div className="auth-shell__content">

//           <h1>
//              {t("hero.title")}
//           </h1>

//           <p>
//               {t("hero.subtitle")}
//           </p>

//           <div className="auth-shell__features">

//       <div className="feature-item">

//            <Sprout size={28} />

//              <span>
//                {t("hero.crop")}
//              </span>

//       </div>

//       <div className="feature-item">

//           <Users size={28} />

//             <span>
//               {t("hero.labor")}
//             </span>

//       </div>

//     <div className="feature-item">

//        <Droplets size={28} />

//          <span>
//            {t("hero.irrigation")}
//           </span>

//        </div>

//       <div className="feature-item">

//          <BarChart3 size={28} />

//             <span>
//               {t("hero.analytics")}
//             </span>

//      </div>

//     </div>

//         </div>

//       </div>


//      {/* {bottom left badge} */}
//     <div className="auth-shell__badge">

//     <div className="auth-shell__badge-icon">
//         <ShieldCheck size={34} />
//     </div>

//      <div>
//         <h4>Secure. Simple. Reliable.</h4>

//          <p>
//          Built for farmers, by people who understand farming.
//          </p>
//       </div>

//     </div>


//       {/* Right Side Card */}

//       <div className="auth-card-wrapper">

//         {/* Language Toggle */}

//         <div className="auth-shell__lang">

//           <div
//             className="lang-toggle"
//             role="group"
//             aria-label={t(
//               "topbar.language"
//             )}
//           >

//             {SUPPORTED_LANGUAGES.map(
//               (l) => (

//                 <button
//                   key={l.code}
//                   type="button"
//                   className={
//                     i18n.language?.startsWith(
//                       l.code
//                     )
//                       ? "lang-toggle__btn lang-toggle__btn--active"
//                       : "lang-toggle__btn"
//                   }
//                   onClick={() =>
//                     i18n.changeLanguage(
//                       l.code
//                     )
//                   }
//                 >

//                   {t(l.labelKey)}

//                 </button>
//               )
//             )}

//           </div>

//         </div>

//         {/* Auth Card */}

//         <div className="auth-card">

//           <h2 className="auth-card__title">

//             {title}

//           </h2>

//           {subtitle && (

//             <p className="auth-card__subtitle">

//               {subtitle}

//             </p>
//           )}

//           <div className="auth-card__body">

//             {children}

//           </div>

//           {footer && (

//             <div className="auth-card__footer">

//               {footer}

//             </div>
//           )}

//         </div>

//       </div>

//     </div>
//   );
// }

import "./AuthShell.css";

import {
  useTranslation,
} from "react-i18next";

import {
  useNavigate,
} from "react-router-dom";

import {
  SUPPORTED_LANGUAGES,
} from "../i18n/i18n";

import farmBg
from "../assets/farm-bg.jpg";

import {
  ShieldCheck,
  Sprout,
  Users,
  Droplets,
  BarChart3,
  Tractor,
  Store,
} from "lucide-react";

export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
}) {

  const {
    t,
    i18n,
  } = useTranslation();

  const navigate =
    useNavigate();

  return (

    <div className="
      auth-shell
    ">

      <img
        src={farmBg}
        alt="
          Farm Background
        "
        className="
          auth-bg-image
        "
      />

      {/* Overlay */}

      <div className="
        auth-shell__overlay
      "></div>

      {/* Left Side */}

      <div className="
        auth-shell__hero
      ">

        <div className="
          auth-shell__brand
        ">

          <div className="
            auth-shell__logo
          ">
            HY
          </div>

          <div className="
            auth-shell__brand-text
          ">

            <h2>
              {t(
                "app.name"
              )}
            </h2>

            <p>
              {t("app.tagline")}
            </p>

          </div>

        </div>

        <div className="
          auth-shell__content
        ">

          <h1>
            {t(
              "hero.title"
            )}
          </h1>

          <p>
            {t(
              "hero.subtitle"
            )}
          </p>

          {/* FEATURES */}

          <div className="
            auth-shell__features
          ">

            <div className="
              feature-item
            ">

              <Sprout
                size={28}
              />

              <span>
                {t(
                  "hero.crop"
                )}
              </span>

            </div>

            <div className="
              feature-item
            ">

              <Users
                size={28}
              />

              <span>
                {t(
                  "hero.labor"
                )}
              </span>

            </div>

            <div className="
              feature-item
            ">

              <Droplets
                size={28}
              />

              <span>
                {t(
                  "hero.irrigation"
                )}
              </span>

            </div>

            <div className="
              feature-item
            ">

              <BarChart3
                size={28}
              />

              <span>
                {t(
                  "hero.analytics"
                )}
              </span>

            </div>

          </div>

          {/* CTA BUTTONS */}

          <div className="
            auth-shell__cta
          ">

            <button
              className="
                auth-shell__cta-btn
              "
              onClick={() =>
                navigate(
                  "/marketplace"
                )
              }
            >

              <Store
                size={20}
              />

              {t(
                "hero.marketplace"
              )}

            </button>

            <button
              className="
                auth-shell__cta-btn
              "
              onClick={() =>
                navigate(
                  "/rentals"
                )
              }
            >

              <Tractor
                size={20}
              />

              {t(
                "hero.rentals"
              )}

            </button>

          </div>

        </div>

      </div>

      {/* Bottom Left Badge */}

      <div className="
        auth-shell__badge
      ">

        <div className="
          auth-shell__badge-icon
        ">

          <ShieldCheck
            size={34}
          />

        </div>

        <div>

          <h4>
            Secure. Simple.
            Reliable.
          </h4>

          <p>
            Built for
            farmers,
            by people
            who understand
            farming.
          </p>

        </div>

      </div>

      {/* Right Side Card */}

      <div className="
        auth-card-wrapper
      ">

        {/* Language Toggle */}

        <div className="
          auth-shell__lang
        ">

          <div
            className="
              lang-toggle
            "
            role="group"
            aria-label={
              t(
                "topbar.language"
              )
            }
          >

            {SUPPORTED_LANGUAGES.map(
              (
                l
              ) => (

                <button
                  key={l.code}
                  type="button"
                  className={

                    i18n
                      .language
                      ?.startsWith(
                        l.code
                      )

                      ? "lang-toggle__btn lang-toggle__btn--active"

                      : "lang-toggle__btn"
                  }

                  onClick={() =>
                    i18n
                      .changeLanguage(
                        l.code
                      )
                  }
                >

                  {t(
                    l.labelKey
                  )}

                </button>
              )
            )}

          </div>

        </div>

        {/* Auth Card */}

        <div className="
          auth-card
        ">

          <h2 className="
            auth-card__title
          ">

            {title}

          </h2>

          {subtitle && (

            <p className="
              auth-card__subtitle
            ">

              {subtitle}

            </p>

          )}

          <div className="
            auth-card__body
          ">

            {children}

          </div>

          {footer && (

            <div className="
              auth-card__footer
            ">

              {footer}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}