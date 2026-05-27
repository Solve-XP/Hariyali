import "./StaticPages.css";

export default function PrivacyPolicy() {

  return (

    <div className="page">


      {/* HERO */}

      <div className="static-page__hero">

        <h1>
          Privacy Policy
        </h1>

        <p>
          Your privacy matters to us.
          This policy explains how
          Field Management collects,
          stores, and protects
          your information.
        </p>

      </div>

      {/* CONTENT */}

      <div className="page__section">

        <div className="static-card">

          <div className="static-section">

            <h2>
              Information We Collect
            </h2>

            <p>
              We may collect profile
              information, farm records,
              marketplace activity,
              rental data, and account
              details to provide
              platform services
              efficiently.
            </p>

          </div>

          <div className="static-section">

            <h2>
              How We Use Data
            </h2>

            <ul>

              <li>
                To improve farming
                management services
              </li>

              <li>
                To personalize
                your dashboard
              </li>

              <li>
                To improve
                marketplace experience
              </li>

              <li>
                To ensure
                platform security
              </li>

            </ul>

          </div>

          <div className="static-section">

            <h2>
              Data Protection
            </h2>

            <p>
              We use secure systems
              and modern security
              practices to protect
              your account and
              information from
              unauthorized access.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}