import "./StaticPages.css";

import {
  Mail,
  Phone,
  Globe,
} from "lucide-react";

export default function Contact() {

  return (

    <div className="static-page">

      <div className="static-page__hero">

        <h1>
          Contact Us
        </h1>

        <p>
          Have questions,
          suggestions, or
          need assistance?
          We’re here to help.
        </p>

      </div>

      <div className="contact-grid">

        {/* EMAIL */}

        <div className="contact-card">

          <Mail
            size={28}
          />

          <h3>
            Email Support
          </h3>

          <p>
            contact@solvexp.in
          </p>

        </div>

        {/* PHONE */}

        <div className="contact-card">

          <Phone
            size={28}
          />

          <h3>
            Phone Support
          </h3>

          <p>
            +91 97668 63090
          </p>

        </div>

        {/* WEBSITE */}

        <div className="contact-card">

          <Globe
            size={28}
          />

          <h3>
            Website
          </h3>

          <p>
            https://solvexp.in
          </p>

        </div>

      </div>

    </div>
  );
}