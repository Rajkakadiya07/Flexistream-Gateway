import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../Layout/Layout";

const Profile = () => {
  const navigate = useNavigate();
  const [adminDetails, setAdminDetails] = useState({});
  const [formData, setFormData] = useState({
    username: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchAdminDetails();
  }, []);

  const fetchAdminDetails = async () => {
    try {
      const response = await fetch("http://localhost:3001/get-admin-details", {
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        setAdminDetails(data);
        setFormData((prevState) => ({
          ...prevState,
          username: data.username || "",
        }));
      } else {
        console.error("Failed to fetch admin details");
      }
    } catch (error) {
      console.error("Error fetching admin details:", error);
    }
  };

  return (
    <Layout>
      <div className="dash-content">
        <div className="activity">
          <div className="breadcrumb-container">
            <h1 className="text">Profile</h1>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
              <div className="container">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <i className="fas fa-tachometer-alt me-1" />
                      <Link to="/Dashboard">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <i className="fas fa-user me-1" />
                      <Link className="active">Profile</Link>
                    </li>
                  </ol>
                </nav>
              </div>
            </nav>
          </div>
          <div className="row mt-4">
            <div className="col-lg-12 mt-3">
              <div className="card mb-4">
                <div className="card-body">
                  {/* Profile form */}
                  <form>
                    <div className="mb-3">
                      <label htmlFor="username" className="form-label">
                        Username
                      </label>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        className="form-control"
                        value={formData.username}
                        readOnly
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="oldPassword" className="form-label">
                        Old Password
                      </label>
                      <input
                        type="password"
                        id="oldPassword"
                        name="oldPassword"
                        className="form-control"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="newPassword" className="form-label">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        className="form-control"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="confirmPassword" className="form-label">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        className="form-control"
                      />
                    </div>
                    <button type="button" className="btn btn-outline-success">
                      Update
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
