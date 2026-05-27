import "./StaticPages.css";

export default function Support() {

  return (

    <div className="static-page">

      <div className="static-page__hero">

        <h1>
          Support Center
        </h1>

        <p>
          Need help using
          Field Management?
          Find quick answers
          and support resources
          below.
        </p>

      </div>

      {/* FAQ */}

      <div className="faq-list">

        <div className="faq-card">

          <h3>
            How do I add a farm?
          </h3>

          <p>
            Navigate to the
            Farms section and
            click the
            “Add Farm” button
            to create a new
            farm record.
          </p>

        </div>

        <div className="faq-card">

          <h3>
            How do I create
            a marketplace listing?
          </h3>

          <p>
            Open Marketplace
            and click
            “Create Listing”
            to upload crop
            or equipment
            information.
          </p>

        </div>

        <div className="faq-card">

          <h3>
            How do equipment
            rentals work?
          </h3>

          <p>
            Browse rentals,
            contact the owner,
            and discuss rental
            details directly
            using call or
            WhatsApp.
          </p>

        </div>

        <div className="faq-card">

          <h3>
            I found incorrect
            information.
            What should I do?
          </h3>

          <p>
            Contact support
            through the contact
            section and we will
            help resolve it.
          </p>

        </div>

      </div>

    </div>
  );
}