import "./Dashboard.css";

export default function Dashboard() {

  return (

    <div className="dashboard-page">

      <div className="dashboard-header">

        <h1>
          Merchant Dashboard
        </h1>

        <p>
          Manage purchases, suppliers,
          stock and transactions.
        </p>

      </div>

      <div className="dashboard-grid">

        <div className="dashboard-card">

          <h3>
            Total Orders
          </h3>

          <p>
            0
          </p>

        </div>

        <div className="dashboard-card">

          <h3>
            Suppliers
          </h3>

          <p>
            0
          </p>

        </div>

        <div className="dashboard-card">

          <h3>
            Inventory
          </h3>

          <p>
            0
          </p>

        </div>

        <div className="dashboard-card">

          <h3>
            Expenses
          </h3>

          <p>
            ₹0
          </p>

        </div>

      </div>

    </div>
  );
}