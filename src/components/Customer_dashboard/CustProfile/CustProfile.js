import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Sidenav from "../Sidenav/Sidenav";

const CustProfile = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChangePassword = async () => {
    setError(null); // Reset any previous errors

    // Check if new password matches confirm new password
    if (newPassword !== confirmNewPassword) {
      setError("New password does not match confirm password");
      return;
    }

    try {
      // Make a request to update the password
      const response = await axios.put(
        "http://localhost:3001/update-password",
        {
          oldPassword,
          newPassword,
          confirmNewPassword,
        }
      );
      console.log(response.data);
      setSuccess(true); // Set success flag
    } catch (error) {
      console.error("Error updating password:", error);
      setError("Error updating password. Please try again.");
    }
  };

  const [customer, setCustomer] = useState({
    first_name: "",
    user_name: "",
    contact1: "",
    contact2: "",
    address: "",
    location: "",
    account_details: "",
  });

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/customer-profile"
        );
        setCustomer({
          first_name: response.data.customer_name,
          user_name: response.data.username,
          contact1: response.data.customer_contact_1 || "",
          contact2: response.data.customer_contact_2 || "",
          address: response.data.customer_address || "",
          location: response.data.customer_location || "",
          account_details: response.data.customer_account_details || "",
        });
      } catch (error) {
        console.error("Error fetching customer:", error);
      }
    };
    fetchCustomer();
  }, []);

  const updateProfile = async () => {
    try {
      const response = await axios.put(
        "http://localhost:3001/update-customer-profile",
        customer
      );
      alert("Profile Updated Successfully");
      console.log("Profile updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating customer profile:", error);
    }
  };

  const backHome = () => {
    window.location.href = "/";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prevCustomer) => ({
      ...prevCustomer,
      [name]: value,
    }));
  };

  return (
    <Sidenav>
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
                      <Link onClick={backHome}>Dashboard</Link>
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
                  <ul className="nav nav-tabs" id="myTabs" role="tablist">
                    <li className="nav-item" role="presentation">
                      <a
                        className="nav-link active"
                        id="profile-tab"
                        data-bs-toggle="tab"
                        href="#profile"
                        role="tab"
                        aria-controls="profile"
                        aria-selected="true"
                      >
                        Profile
                      </a>
                    </li>
                    <li className="nav-item" role="presentation">
                      <a
                        className="nav-link"
                        id="password-tab"
                        data-bs-toggle="tab"
                        href="#password"
                        role="tab"
                        aria-controls="password"
                        aria-selected="false"
                      >
                        Password
                      </a>
                    </li>
                  </ul>
                  <div className="tab-content">
                    <div
                      className="tab-pane fade show active"
                      id="profile"
                      role="tabpanel"
                    >
                      <div className="row ">
                        <div className="col-lg-12 mt-4">
                          <div className="row ">
                            <div className="col-sm-3">
                              <p className="mb-0 ">First Name</p>
                            </div>
                            <div className="col-sm-9">
                              <input
                                type="text"
                                id="firstName"
                                name="first_name"
                                className="form-control"
                                value={customer.first_name}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <hr />
                          <div className="row">
                            <div className="col-sm-3">
                              <p className="mb-0">User Name</p>
                            </div>
                            <div className="col-sm-9">
                              <input
                                type="text"
                                id="userName"
                                name="user_name"
                                className="form-control"
                                value={customer.user_name}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <hr />
                          <div className="row">
                            <div className="col-sm-3">
                              <p className="mb-0">Contact 1</p>
                            </div>
                            <div className="col-sm-9">
                              <input
                                type="text"
                                id="contact1"
                                name="contact1"
                                className="form-control"
                                value={customer.contact1}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <hr />
                          <div className="row">
                            <div className="col-sm-3">
                              <p className="mb-0">Contact 2</p>
                            </div>
                            <div className="col-sm-9">
                              <input
                                type="text"
                                id="contact2"
                                name="contact2"
                                className="form-control"
                                value={customer.contact2}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <hr />
                          <div className="row">
                            <div className="col-sm-3">
                              <p className="mb-0">Address</p>
                            </div>
                            <div className="col-sm-9">
                              <input
                                type="text"
                                id="address"
                                name="address"
                                className="form-control"
                                value={customer.address}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <hr />
                          <div className="row">
                            <div className="col-sm-3">
                              <p className="mb-0">Location</p>
                            </div>
                            <div className="col-sm-9">
                              <input
                                type="text"
                                id="location"
                                name="location"
                                className="form-control"
                                value={customer.location}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <hr />
                          <div className="row">
                            <div className="col-sm-3">
                              <p className="mb-0">Account details</p>
                            </div>
                            <div className="col-sm-9">
                              <input
                                type="text"
                                id="accountDetails"
                                name="account_details"
                                className="form-control"
                                value={customer.account_details}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="row mt-4">
                            <div className="d-flex justify-content-left  mb-2">
                              <button
                                type="button"
                                className="btn btn-outline-success ms-1"
                                onClick={updateProfile}
                              >
                                Update
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="password"
                      role="tabpanel"
                    >
                      <div className="row ">
                        <div className="col-lg-12 mt-4">
                          <div className="row">
                            <div className="col-sm-3">
                              <p className="mb-0">Old Password</p>
                            </div>
                            <div className="col-sm-9">
                              <input
                                type="password"
                                id="oldPassword"
                                className="form-control"
                                placeholder="Enter your old password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                              />
                            </div>
                          </div>
                          <hr />
                          <div className="row">
                            <div className="col-sm-3">
                              <p className="mb-0">New Password</p>
                            </div>
                            <div className="col-sm-9">
                              <input
                                type="password"
                                id="newPassword"
                                className="form-control"
                                placeholder="Enter your new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                              />
                            </div>
                          </div>
                          <hr />
                          <div className="row">
                            <div className="col-sm-3">
                              <p className="mb-0">Confirm New Password</p>
                            </div>
                            <div className="col-sm-9">
                              <input
                                type="password"
                                id="confirmNewPassword"
                                className="form-control"
                                placeholder="Confirm your new password"
                                value={confirmNewPassword}
                                onChange={(e) =>
                                  setConfirmNewPassword(e.target.value)
                                }
                              />
                            </div>
                          </div>
                          <div className="row mt-4">
                            <div className="d-flex justify-content-left mb-2">
                              <button
                                type="button"
                                className="btn btn-outline-success ms-1"
                                onClick={handleChangePassword}
                              >
                                Update
                              </button>
                            </div>
                          </div>
                          {error && (
                            <div className="alert alert-danger mt-3">
                              {error}
                            </div>
                          )}
                          {success && (
                            <div className="alert alert-success mt-3">
                              Password updated successfully
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Sidenav>
  );
};

export default CustProfile;
