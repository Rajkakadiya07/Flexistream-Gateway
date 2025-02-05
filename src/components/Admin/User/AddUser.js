import React, { useState } from "react";
import Layout from "../Layout/Layout";
import { Link, useNavigate } from "react-router-dom";

const AddUser = () => {
  const navigate = useNavigate();

  const dashboardClick = (event) => {
    event.preventDefault();
    navigate("/Dashboard");
  };

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullName: "",
    contact1: "",
    contact2: "",
    address: "",
    location: "",
    accountDetails: "",
    remarks: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleUsernameBlur = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/checkUsername?username=${formData.username}`
      );
      const data = await response.json();
      if (!data.available) {
        alert("Username already taken");
      }
    } catch (error) {
      console.error("Error checking username availability:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log(data);
      // Clear form fields after successful submission
      setFormData({
        username: "",
        password: "",
        fullName: "",
        contact1: "",
        contact2: "",
        address: "",
        location: "",
        accountDetails: "",
        remarks: "",
      });
    } catch (error) {
      console.error("Error during form submission:", error);
    }
  };

  return (
    <Layout>
      <div className="dash-content">
        <div className="activity">
          <div className="breadcrumb-container">
            <h1 className="text"> ADD User</h1>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
              <div className="container">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <i className="fas fa-tachometer-alt me-1" />
                      <Link onClick={dashboardClick}>Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <i className="fas fa-users me-1" />
                      <Link className="active">Add User</Link>
                    </li>
                  </ol>
                </nav>
              </div>
            </nav>
          </div>

          <div className="row mt-4">
            <div className="col-lg-12 ">
              <div className="card mb-4">
                <div className="card-body">
                  <h6 className="text-mute mt-4">Account Detail :</h6>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">Username</p>
                    </div>
                    <div className="col-sm-9">
                      <input
                        type="text"
                        id="username"
                        placeholder="username"
                        className="form-control"
                        value={formData.username}
                        onChange={handleChange}
                        onBlur={handleUsernameBlur}
                      />
                    </div>
                  </div>
                  <div className="row mt-2">
                    <div className="col-sm-3">
                      <p className="mb-0">Password</p>
                    </div>
                    <div className="col-sm-9">
                      <input
                        type="password"
                        id="password"
                        placeholder="password"
                        className="form-control"
                        value={formData.password}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <h6 className="text-mute mt-3">Personal Detail :</h6>
                  <hr />
                  <div className="row mt-2">
                    <div className="col-sm-3">
                      <p className="mb-0">Full Name</p>
                    </div>
                    <div className="col-sm-9">
                      <input
                        type="text"
                        id="fullName"
                        placeholder="Full Name"
                        className="form-control"
                        value={formData.fullName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="row mt-2">
                    <div className="col-sm-3">
                      <p className="mb-0">Contact No.</p>
                    </div>
                    <div className="col-sm-9">
                      <input
                        type="text"
                        id="contact1"
                        placeholder="Phone Number 1"
                        className="form-control"
                        value={formData.contact1}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="row mt-2">
                    <div className="col-sm-3">
                      <p className="mb-0">Contact No.</p>
                    </div>
                    <div className="col-sm-9">
                      <input
                        type="text"
                        id="contact2"
                        placeholder="Phone Number 2"
                        className="form-control"
                        value={formData.contact2}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="row mt-2">
                    <div className="col-sm-3">
                      <p className="mb-0">Address</p>
                    </div>
                    <div className="col-sm-9">
                      <input
                        type="text"
                        id="address"
                        placeholder="Address"
                        className="form-control"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="row mt-2">
                    <div className="col-sm-3">
                      <p className="mb-0">Location</p>
                    </div>
                    <div className="col-sm-9">
                      <input
                        type="text"
                        id="location"
                        placeholder="Location"
                        className="form-control"
                        value={formData.location}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <h6 className="text-mute mt-4">Bank Detail :</h6>
                  <hr />
                  <div className="row mt-2">
                    <div className="col-sm-3">
                      <p className="mb-0">Account No.</p>
                    </div>
                    <div className="col-sm-9">
                      <input
                        type="text"
                        id="accountDetails"
                        placeholder="Account Number"
                        className="form-control"
                        value={formData.accountDetails}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <h6 className="text-mute mt-4">Other Detail :</h6>
                  <hr />
                  <div className="row mt-2">
                    <div className="col-sm-3">
                      <p className="mb-0">Remarks</p>
                    </div>
                    <div className="col-sm-9">
                      <textarea
                        id="remarks"
                        placeholder="Remarks"
                        className="form-control"
                        rows="4"
                        value={formData.remarks}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <hr />
                  <div className="row mt-4">
                    <div className="d-flex justify-content-left  mb-2">
                      <div className="d-flex justify-content-left  mb-2">
                        <button
                          onClick={handleSubmit}
                          type="button"
                          className="btn btn-outline-success ms-1"
                        >
                          Add User
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddUser;
