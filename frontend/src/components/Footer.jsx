import "./Footer.css";

import {
  Heart,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

export default function Footer() {


    const navigate =
  useNavigate();

  const openSolveXP =
    () => {

      window.open(
        "https://solvexp.in",
        "_blank"
      );
    };

  return (

    <footer
      className="
        app-footer
      "
    >

      <div
        className="
          app-footer__content
        "
      >

        {/* LEFT */}

        <div
          className="
            app-footer__copyright
          "
        >

          © 2026

        </div>

        {/* CENTER */}

        <div
          className="
            app-footer__links
          "
        >

          <button
            type="button"
            onClick={() => navigate( "/privacy-policy")
  }
          >
            Privacy Policy
          </button>

          <button
            type="button"
            onClick={() => navigate( "/terms")}
          >
            Terms
          </button>

          <button
            type="button"
            onClick={() => navigate( "/support")}
          
          >
            Support
          </button>

          <button
            type="button"
            onClick={() => navigate( "/contact")}
          >
            Contact
          </button>

        </div>

        {/* RIGHT */}

        <button
          type="button"
          className="
            app-footer__brand
          "
          onClick={
            openSolveXP
          }
        >

          <span>
            Built with
          </span>

          <Heart
            size={16}
            fill="currentColor"
          />

          <span>
            by
          </span>

          <strong>
            Solve XP
          </strong>

        </button>

      </div>

    </footer>
  );
}   