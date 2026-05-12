import "./Dashboard.css";

export default function Dashboard() {

  return (

    <div className="dashboard-page">

      <div className="dashboard-header">

        <h1>
          Admin Dashboard
        </h1>

        <p>
          Manage users, farmers,
          merchants, analytics and
          system settings.
        </p>

      </div>

      <div className="dashboard-grid">

        <div className="dashboard-card">

          <h3>
            Total Users
          </h3>

          <p>
            0
          </p>

        </div>

        <div className="dashboard-card">

          <h3>
            Total Farmers
          </h3>

          <p>
            0
          </p>

        </div>

        <div className="dashboard-card">

          <h3>
            Total Merchants
          </h3>

          <p>
            0
          </p>

        </div>

        <div className="dashboard-card">

          <h3>
            Revenue
          </h3>

          <p>
            ₹0
          </p>

        </div>

      </div>

    </div>
  );
}