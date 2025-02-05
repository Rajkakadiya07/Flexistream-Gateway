import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../Layout/Layout";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    devicesCount: 0,
    sensorsCount: 0,
    gatewaysCount: 0,
    custcount : 0,
    users: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("http://localhost:3001/dashboard_data");
      if (response.ok) {
        const data = await response.json();
        // Get only the latest five customers
        const latestCustomers = data.users.slice(0, 5);
        setDashboardData({ ...data, users: latestCustomers });
      } else {
        console.error("Error fetching dashboard data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  // Function to delete a user
  const deleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch(`http://localhost:3001/customers/${userId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          const updatedUsers = dashboardData.users.filter(user => user.customer_id !== userId);
          setDashboardData({ ...dashboardData, users: updatedUsers });
          alert("User Deleted Successfully");
        } else {
          console.error("Error deleting user:", response.statusText);
        }
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  return (
    <Layout>
      <div className="dashboard-content">
        <div className="overview">
          <div className="breadcrumb-container">
            <h1 className="text">Dashboard</h1>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
              <div className="container">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <i className="fas fa-tachometer-alt me-1" />
                      <Link to="/">Dashboard</Link>
                    </li>
                  </ol>
                </nav>
              </div>
            </nav>
          </div>

          {/* Cards for Devices, Sensors, and Gateways */}
          <div className="row mt-4">
            <div className="col-md-3">
              <div className="card bg-info text-white">
                <div className="card-body">
                  <h5 className="card-title">Devices</h5>
                  <p className="card-text">{dashboardData.devicesCount}</p>
                </div>
              </div>  
            </div>
            <div className="col-md-3">
              <div className="card bg-success text-white">
                <div className="card-body">
                  <h5 className="card-title">Sensors</h5>
                  <p className="card-text">{dashboardData.sensorsCount}</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-danger text-white">
                <div className="card-body">
                  <h5 className="card-title">Gateways</h5>
                  <p className="card-text">{dashboardData.gatewaysCount}</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-warning text-white">
                <div className="card-body">
                  <h5 className="card-title">Customers</h5>
                  <p className="card-text">{dashboardData.custcount}</p>
                </div>
              </div>
            </div>
           
          </div>

          {/* Users Table */}
          <div className="mt-4">
            <h3>Users</h3>
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Contact Number 1</th>
                    <th>Address</th>
                    <th>Location</th>
                    <th>Account Details</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.users.map((user, index) => (
                    <tr key={index}>
                      <td>{user.customer_name}</td>
                      <td>{user.customer_contact_1}</td>
                      <td>{user.customer_address}</td>
                      <td>{user.customer_location}</td>
                      <td>{user.customer_account_details}</td>
                      <td>
                        <button
                          style={{ fontSize: "20px", marginRight: "10px" }}
                          className="btn btn-link text-danger"
                          onClick={() => deleteUser(user.customer_id)}
                        >
                          <i className="fas fa-trash" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
