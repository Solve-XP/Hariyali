import "./StaticPages.css";

export default function Terms() {

  return (

    <div className="static-page">

      <div className="static-page__hero">

        <h1>
          Terms & Conditions
        </h1>

        <p>
          Please read these terms
          carefully before using
          Field Management.
        </p>

      </div>

      <div className="static-card">

        <div className="static-section">

          <h2>
            User Responsibilities
          </h2>

          <p>
            Users are responsible
            for providing accurate
            information while using
            marketplace, rentals,
            and farm management
            features.
          </p>

        </div>

        <div className="static-section">

          <h2>
            Marketplace Rules
          </h2>

          <ul>

            <li>
              No misleading listings
            </li>

            <li>
              No fraudulent activity
            </li>

            <li>
              Respect platform rules
            </li>

            <li>
              Maintain fair dealings
            </li>

          </ul>

        </div>

        <div className="static-section">

          <h2>
            Account Suspension
          </h2>

          <p>
            Accounts violating
            platform rules may
            be restricted or
            suspended for safety
            and trust purposes.
          </p>

        </div>

      </div>

    </div>
  );
}