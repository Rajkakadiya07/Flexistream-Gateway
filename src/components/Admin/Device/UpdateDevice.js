import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Layout from "../Layout/Layout";
import { Link, useNavigate } from "react-router-dom";

const UpdateDevice = () => {
  const { id } = useParams();
  const [device, setDevice] = useState({
    device_name: "",
    gateway_id: "",
    manufacturer: "",
    model: "",
    serial_number: "",
    firmware_version: "",
    manufacturing_date: "",
    purchase_date: "",
    warranty_expiry_date: "",
    additional_details: "",
    remarks: "",
  });
  const [gateways, setGateways] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const dashboardClick = (event) => {
    event.preventDefault();
    navigate("/Dashboard");
  };

  useEffect(() => {
    const fetchDevice = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/admin/devices/${id}`
        );
        setDevice(response.data);
      } catch (error) {
        console.error("Error fetching device:", error);
      }
    };
    fetchDevice();

    const fetchGateways = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/admin/gateways"
        );
        setGateways(response.data);
      } catch (error) {
        console.error("Error fetching gateways:", error);
      }
    };
    fetchGateways();
  }, [id]);

  const handleUpdate = async () => {
    const validationErrors = {};
    let isValid = true;
  
    // Device Name Validation
    if (!device.device_name.trim()) {
      validationErrors.device_name = "Device name is required";
      isValid = false;
    }
  
    // Manufacturer Validation
    if (!device.manufacturer.trim()) {
      validationErrors.manufacturer = "Manufacturer is required";
      isValid = false;
    }
  
    // Model Validation
    if (!device.model.trim()) {
      validationErrors.model = "Model is required";
      isValid = false;
    }
  
    // Serial Number Validation
    if (!device.serial_number.trim()) {
      validationErrors.serial_number = "Serial Number is required";
      isValid = false;
    }
  
    // Firmware Version Validation
    if (!device.firmware_version.trim()) {
      validationErrors.firmware_version = "Firmware Version is required";
      isValid = false;
    }
  
    // Manufacturing Date Validation
    if (!device.manufacturing_date.trim()) {
      validationErrors.manufacturing_date = "Manufacturing Date is required";
      isValid = false;
    }
  
    // Purchase Date Validation
    if (!device.purchase_date.trim()) {
      validationErrors.purchase_date = "Purchase Date is required";
      isValid = false;
    }
  
    // Warranty Expiry Date Validation
    if (!device.warranty_expiry_date.trim()) {
      validationErrors.warranty_expiry_date = "Warranty Expiry Date is required";
      isValid = false;
    }
  
    // Gateway ID Validation
    if (!device.gateway_id) {
      validationErrors.gateway_id = "Gateway ID is required";
      isValid = false;
    }
  
    // Check if isValid is true and no validation errors
    if (isValid) {
      if (window.confirm("Are you sure you want to update this device?")) {
        try {
          await axios.put(
            `http://localhost:3001/admin/devices/${id}`,
            device
          );
          alert("Device updated successfully");
          navigate(`/Device/device`);
        } catch (error) {
          console.error("Error updating device:", error);
          alert("Failed to update device");
        }
      }
    } else {
      setErrors(validationErrors);
    }
  };
  

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setDevice({ ...device, [id]: value });
  };

  return (
    <Layout>
      <div className="dash-content">
        <div className="activity">
          <div className="breadcrumb-container">
            <h1 className="text">User</h1>
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
                      <Link className="active">Update Device</Link>
                    </li>
                  </ol>
                </nav>
              </div>
            </nav>
          </div>
          <div className="container mt-4">
            <div className="row">
              <div className="col-lg-12 card p-4  ">
                <div className="me-3 mb-4">
                  <h2 className="title">Update Device</h2>
                  <div className="row ">
                    <h6 className="text-mute mt-4 ">Basic Detail :</h6>
                    <hr />
                    <div className="col-lg-12">
                      <div className="row ">
                        <div className="col-sm-3">
                          <p className="mb-0 ">Device Name</p>
                        </div>
                        <div className="col-sm-9">
                          <input
                            type="text"
                            id="device_name"
                            placeholder="Device Name"
                            className="form-control"
                            value={device.device_name || ""}
                            onChange={handleInputChange}
                          />
                          {errors.device_name && (
                            <span className="text-danger">
                              {errors.device_name}
                            </span>
                          )}
                        </div>

                        <div className="col-sm-3 mt-2">
                          <p className="mb-0">Gateway Id</p>
                        </div>
                        <div className="col-sm-9 mt-2">
                          <select
                            className="form-select"
                            id="gateway_id"
                            aria-label="Default select example"
                            value={device.gateway_id || ""}
                            onChange={handleInputChange}
                          >
                            <option value="" disabled>
                              Select Gateway ID
                            </option>
                            {gateways.map((gateway) => (
                              <option key={gateway.id} value={gateway.id}>
                                {gateway.gateway_id}
                              </option>
                            ))}
                          </select>
                          {errors.gateway_id && (
                            <span className="text-danger">
                              {errors.gateway_id}
                            </span>
                          )}
                        </div>

                        <div className="col-sm-3 mt-2">
                          <p className="mb-0">Manufacturer</p>
                        </div>
                        <div className="col-sm-9 mt-2">
                          <input
                            type="text"
                            id="manufacturer"
                            placeholder="Manufacturer"
                            className="form-control"
                            value={device.manufacturer || ""}
                            onChange={handleInputChange}
                          />
                          {errors.manufacturer && (
                            <span className="text-danger">
                              {errors.manufacturer}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <h6 className="text-mute mt-4">Device Detail :</h6>
                    <hr />
                    <div className="col-lg-12">
                      <div className="row ">
                        <div className="col-sm-3">
                          <p className="mb-0">Model</p>
                        </div>
                        <div className="col-sm-9">
                          <input
                            type="text"
                            id="model"
                            placeholder="Model"
                            className="form-control"
                            value={device.model || ""}
                            onChange={handleInputChange}
                          />
                          {errors.model && (
                            <span className="text-danger">{errors.model}</span>
                          )}
                        </div>

                        <div className="col-sm-3 mt-2">
                          <p className="mb-0">Serial Number</p>
                        </div>
                        <div className="col-sm-9 mt-2">
                          <input
                            type="text"
                            id="serial_number"
                            placeholder="Serial Number"
                            className="form-control"
                            value={device.serial_number || ""}
                            onChange={handleInputChange}
                          />
                          {errors.serial_number && (
                            <span className="text-danger">
                              {errors.serial_number}
                            </span>
                          )}
                        </div>

                        <div className="col-sm-3 mt-2">
                          <p className="mb-0">Firmware Version</p>
                        </div>
                        <div className="col-sm-9 mt-2">
                          <input
                            type="text"
                            id="firmware_version"
                            placeholder="Firmware Version"
                            className="form-control"
                            value={device.firmware_version || ""}
                            onChange={handleInputChange}
                          />
                          {errors.firmware_version && (
                            <span className="text-danger">
                              {errors.firmware_version}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <h6 className="text-mute mt-4">Warranty Detail :</h6>
                    <hr />
                    <div className="col-lg-12">
                      <div className="row ">
                        <div className="col-sm-3">
                          <p className="mb-0">Manufacturing Date</p>
                        </div>
                        <div className="col-sm-9">
                          <input
                            type="date"
                            id="manufacturing_date"
                            className="form-control"
                            value={
                              device.manufacturing_date
                                ? device.manufacturing_date.split("T")[0]
                                : ""
                            }
                            onChange={handleInputChange}
                          />
                          {errors.manufacturing_date && (
                            <span className="text-danger">
                              {errors.manufacturing_date}
                            </span>
                          )}
                        </div>

                        <div className="col-sm-3 mt-2">
                          <p className="mb-0">Purchase Date</p>
                        </div>
                        <div className="col-sm-9 mt-2">
                          <input
                            type="date"
                            id="purchase_date"
                            className="form-control"
                            value={
                              device.purchase_date
                                ? device.purchase_date.split("T")[0]
                                : ""
                            }
                            onChange={handleInputChange}
                          />
                          {errors.purchase_date && (
                            <span className="text-danger">
                              {errors.purchase_date}
                            </span>
                          )}
                        </div>

                        <div className="col-sm-3 mt-2">
                          <p className="mb-0">Warranty Expiry Date</p>
                        </div>
                        <div className="col-sm-9 mt-2">
                          <input
                            type="date"
                            id="warranty_expiry_date"
                            className="form-control"
                            value={
                              device.warranty_expiry_date
                                ? device.warranty_expiry_date.split("T")[0]
                                : ""
                            }
                            onChange={handleInputChange}
                          />
                          {errors.warranty_expiry_date && (
                            <span className="text-danger">
                              {errors.warranty_expiry_date}
                            </span>
                          )}
                        </div>

                        <div className="col-sm-3 mt-2">
                          <p className="mb-0">Additional Details</p>
                        </div>
                        <div className="col-sm-9 mt-2">
                          <textarea
                            type="text"
                            id="additional_details"
                            placeholder="Additional Details"
                            className="form-control"
                            rows="4"
                            value={device.additional_details || ""}
                            onChange={handleInputChange}
                          />
                          {errors.additional_details && (
                            <span className="text-danger">
                              {errors.additional_details}
                            </span>
                          )}
                        </div>
                        <div className="col-sm-3 mt-2">
                          <p className="mb-0">Remarks</p>
                        </div>
                        <div className="col-sm-9 mt-2">
                          <textarea
                            type="text"
                            id="remarks"
                            placeholder="Remarks"
                            className="form-control"
                            rows="4"
                            value={device.remarks || ""}
                            onChange={handleInputChange}
                          />
                          {errors.remarks && (
                            <span className="text-danger">
                              {errors.remarks}
                            </span>
                          )}
                        </div>
                        <div className="col-sm-3 mt-2"></div>
                        <div className="col-sm-9 mt-4">
                          <button
                            type="button"
                            className="btn btn-outline-success"
                            onClick={handleUpdate}
                          >
                            Update Device
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

export default UpdateDevice;
