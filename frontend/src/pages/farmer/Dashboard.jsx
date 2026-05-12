import "./Dashboard.css";

export default function Dashboard() {

  return (

    <div className="dashboard-page">

      <div className="dashboard-header">

        <h1>
          Farmer Dashboard
        </h1>

        <p>
          Manage crops, orders,
          products and farm activity.
        </p>

      </div>

      <div className="dashboard-grid">

        <div className="dashboard-card">

          <h3>
            Total Crops
          </h3>

          <p>
            0
          </p>

        </div>

        <div className="dashboard-card">

          <h3>
            Orders
          </h3>

          <p>
            0
          </p>

        </div>

        <div className="dashboard-card">

          <h3>
            Products Listed
          </h3>

          <p>
            0
          </p>

        </div>

        <div className="dashboard-card">

          <h3>
            Earnings
          </h3>

          <p>
            ₹0
          </p>

        </div>

      </div>

    </div>
  );
}