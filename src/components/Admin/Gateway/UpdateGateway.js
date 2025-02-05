import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../Layout/Layout";
import { Link, useParams, useNavigate } from "react-router-dom";

const UpdateGateway = () => {
  const { id } = useParams();
  const [gateway, setGateway] = useState({
    gatewayName: "",
    customerId: "",
    customerName: "",
  });
  const [customerExists, setCustomerExists] = useState(false);
  const [updateDisabled, setUpdateDisabled] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchGateway();
  }, []);

  const navigate = useNavigate();

  const dashboardClick = (event) => {
    event.preventDefault();
    navigate("/Dashboard");
  };

  const fetchGateway = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/admin/gateways/${id}`
      );
      setGateway({
        gatewayName: response.data.gateway_name,
        customerId: response.data.customer_id,
        customerName: response.data.customer_name,
      });
      fetchCustomerName(response.data.customer_id);
    } catch (error) {
      console.error("Error fetching gateway:", error);
    }
  };

  const fetchCustomerName = async (customerId) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/admin/customers/${customerId}`
      );
      setGateway((prevGateway) => ({
        ...prevGateway,
        customerName: response.data.customer_name,
      }));
      setCustomerExists(true);
      setUpdateDisabled(false);
    } catch (error) {
      console.error("Error fetching customer:", error);
      setCustomerExists(false);
      setUpdateDisabled(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGateway((prevGateway) => ({
      ...prevGateway,
      [name]: value,
    }));
    validateInput(name, value);
    if (name === "customerId") {
      fetchCustomerName(value);
    }
  };

  const validateInput = (name, value) => {
    let errorsCopy = { ...errors };
    switch (name) {
      case "customerId":
        errorsCopy.customerId = value.trim() === "" ? "Customer ID is required" : "";
        break;
      case "gatewayName":
        errorsCopy.gatewayName = value.match(/^[a-zA-Z0-9\s]+$/) ? "" : "Gateway Name should only contain alphabet, numbers, and spaces";
        break;
      default:
        break;
    }
    setErrors(errorsCopy);
  };
  

  const updateGateway = async () => {
    try {
      if (!customerExists) {
        alert("Customer with the entered ID does not exist");
        return;
      }

      const response = await axios.put(
        `http://localhost:3001/admin/gateways/${id}`,
        {
          gatewayName: gateway.gatewayName,
          customerId: gateway.customerId,
        }
      );
      alert("Gateway updated successfully");
      navigate('/Gateway/Gateway');
    } catch (error) {
      console.error("Error updating gateway:", error);
    }
  };

  return (
    <Layout>
      <div className="dash-content">
        <div className="activity">
          <div className="breadcrumb-container">
            <h1 className="text">Update Gateway</h1>
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
                      <Link className="active">Update Gateway</Link>
                    </li>
                  </ol>
                </nav>
              </div>
            </nav>
          </div>
          <div className="container mt-4">
            <div className="row">
              <div className="col-lg-12 card p-4 ">
                <div className="me-3 mb-4">
                  <h2 className="title">Gateway Detail</h2>
                  <div className="row">
                    <div className="col-lg-12">
                      <h6 className="text-mute mt-4">Gateway Detail :</h6>
                      <hr />
                      <div className="row">
                        <div className="col-sm-3">
                          <p className="mb-0">Gateway Name</p>
                        </div>
                        <div className="col-sm-9">
                          <input
                            type="text"
                            name="gatewayName"
                            value={gateway.gatewayName}
                            onChange={handleInputChange}
                            placeholder="Gateway Name"
                            className="form-control"
                          />
                          {errors.gatewayName && (
                            <p className="text-danger">{errors.gatewayName}</p>
                          )}
                        </div>
                        <div className="col-sm-3 mt-2">
                          <p className="mb-0">Customer ID</p>
                        </div>
                        <div className="col-sm-9 mt-2">
                          <input
                            type="text"
                            name="customerId"
                            value={gateway.customerId}
                            onChange={handleInputChange}
                            placeholder="Customer ID"
                            className="form-control"
                          />
                          {errors.customerId && (
                            <p className="text-danger">{errors.customerId}</p>
                          )}
                        </div>
                        <div className="col-sm-3 mt-2">
                          <p className="mb-0">Customer Name</p>
                        </div>
                        <div className="col-sm-9 mt-2">
                          {customerExists ? (
                            <input
                              type="text"
                              name="customerName"
                              value={gateway.customerName}
                              onChange={handleInputChange}
                              placeholder="Customer Name"
                              className="form-control"
                              disabled
                            />
                          ) : (
                            <p className="text-danger">User not found</p>
                          )}
                        </div>
                        <div className="col-sm-3 mt-2"></div>
                        <div className="col-sm-9 mt-4">
                          <button
                            type="button"
                            onClick={updateGateway}
                            className="btn btn-outline-success"
                            disabled={updateDisabled}
                          >
                            UPDATE Gateway
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
      </div>
    </Layout>
  );
};

export default UpdateGateway;
