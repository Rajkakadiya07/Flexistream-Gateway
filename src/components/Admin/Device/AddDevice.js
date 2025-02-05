import React, { useState, useEffect } from "react";
import Layout from "../Layout/Layout";
import { Link, useNavigate } from "react-router-dom";

const AddDevice = () => {
  const navigate = useNavigate();

  const [sensorData, setSensorData] = useState({
    sensorName: "",
    sensorCalibration: "",
    deviceId: "",
  });

  const [deviceDropdown, setDeviceDropdown] = useState([]);
  const [sensorErrors, setSensorErrors] = useState({
    sensorName: "",
    sensorCalibration: "",
    deviceId: "",
  });

  // Function to fetch devices for dropdown
  const fetchDevicesDropdown = async () => {
    try {
      const response = await fetch("http://localhost:3001/devicesDropdown");
      if (response.ok) {
        const devices = await response.json();
        console.log("Devices:", devices);
        setDeviceDropdown(devices);
      } else {
        console.error("Failed to fetch devices for dropdown");
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };

  useEffect(() => {
    fetchDevicesDropdown();
  }, []); // Fetch devices on component mount

  const handleSensorInputChange = (event) => {
    const { id, value } = event.target;
    setSensorData((prevData) => ({
      ...prevData,
      [id]: value,
    }));

    if (id === "deviceId") {
      const selectedDevice = deviceDropdown.find(
        (device) => device.device_id === value
      );
      setSensorData((prevData) => ({
        ...prevData,
        deviceName: selectedDevice?.device_name || "",
      }));

      // Display selected device ID and name in the console
      console.log("Selected Device ID:", value);
      // console.log("Selected Device Name:", selectedDevice?.device_name || "");
    }
    setSensorErrors((prevErrors) => ({
      ...prevErrors,
      [id]: "",
    }));
  };

  const validateSensorData = () => {
    let errors = {};
    if (sensorData.sensorName.trim() === "") {
      errors.sensorName = "Sensor Name is required";
    } else {
      if (!sensorData.sensorName.match(/^[a-zA-Z0-9 ]*$/)) {
        errors.sensorName =
          "Sensor name can only contain alphabets and numbers";
      }
    }

    if (sensorData.sensorCalibration.trim() === "") {
      errors.sensorCalibration = "Sensor calibration is required";
    } else if (isNaN(parseFloat(sensorData.sensorCalibration))) {
      errors.sensorCalibration = "Sensor calibration must be a number";
    }

    if (sensorData.deviceId.trim() === "") {
      errors.deviceId = "Device ID is required";
    }

    return errors;
  };

  const handleAddSensor = async () => {
    const errors = validateSensorData();
    if (Object.keys(errors).length === 0) {
      try {
        const response = await fetch("http://localhost:3001/addSensor", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sensorData),
        });

        if (response.ok) {
          const result = await response.json();
          console.log(result.message);
          alert("Sensor added success");
          setSensorData({});
        } else {
          const errorData = await response.json();
          console.error("Failed to add sensor:", errorData.message);
        }
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    } else {
      // Set errors to display in UI
      setSensorErrors(errors);
    }
  };

  const [gatewayData, setGatewayData] = useState({
    gatewayName: "",
    customerId: "",
    customerName: "",
  });

  const [customerDropdown, setCustomerDropdown] = useState([]);
  const [gatewayErrors, setGatewayErrors] = useState({
    gatewayName: "",
    customerId: "",
  });

  // Function to fetch customers for dropdown
  const fetchCustomersDropdown = async () => {
    try {
      const response = await fetch("http://localhost:3001/customersDropdown");
      if (response.ok) {
        const customers = await response.json();
        console.log("Customers:", customers);
        setCustomerDropdown(customers);
      } else {
        console.error("Failed to fetch customers for dropdown");
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };

  useEffect(() => {
    fetchCustomersDropdown();
  }, []); // Fetch customers on component mount

  const handleGatewayInputChange = (event) => {
    const { id, value } = event.target;
    setGatewayData((prevData) => ({
      ...prevData,
      [id]: value,
    }));

    if (id === "customerId") {
      const selectedCustomer = customerDropdown.find(
        (customer) => customer.customer_id === Number(value)
      );
      setGatewayData((prevData) => ({
        ...prevData,
        customerName: selectedCustomer?.customer_name || "",
      }));
    }
    setGatewayErrors((prevErrors) => ({
      ...prevErrors,
      [id]: "",
    }));
  };
  const validateGatewayData = () => {
    let errors = {};

    if (gatewayData.gatewayName.trim() === "") {
      errors.gatewayName = "Gateway Name is required";
    } else {
      if (!gatewayData.gatewayName.match(/^[a-zA-Z0-9 ]*$/)) {
        errors.gatewayName =
          "Gateway name can only contain alphabets and numbers";
      }
    }

    if (gatewayData.customerId.trim() === "") {
      errors.customerId = "Customer ID is required";
    }

    return errors;
  };

  const handleAddGateway = async () => {
    const errors = validateGatewayData();
    if (Object.keys(errors).length === 0) {
      try {
        const response = await fetch("http://localhost:3001/addGateway", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(gatewayData),
        });

        if (response.ok) {
          const result = await response.json();
          console.log(result.message);
          alert("Gateway added successfully");
        } else {
          const errorData = await response.json();
          console.error("Failed to add gateway:", errorData.message);
        }
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    } else {
      // Set errors to display in UI
      setGatewayErrors(errors);
    }
  };

  const [deviceData, setDeviceData] = useState({
    deviceName: "",
    gatewayId: "",
    manufacturer: "",
    model: "",
    serialNumber: "",
    firmwareVersion: "",
    manufacturingDate: "",
    purchaseDate: "",
    warrantyExpiryDate: "",
    additionalDetails: "",
    remarks: "",
  });

  const [gatewayIds, setGatewayIds] = useState([]);
  const [deviceErrors, setDeviceErrors] = useState({
    deviceName: "",
    gatewayId: "",
    manufacturer: "",
    serialNumber: "",
    firmwareVersion: "",
    manufacturingDate: "",
    purchaseDate: "",
    warrantyExpiryDate: "",
    additionalDetails: "",
    remarks: "",
  });

  const fetchGatewayIds = async () => {
    try {
      const response = await fetch("http://localhost:3001/gatewayIds");
      if (response.ok) {
        const gatewayIds = await response.json();
        setGatewayIds(gatewayIds);
      } else {
        console.error("Failed to fetch gateway IDs");
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };

  useEffect(() => {
    fetchGatewayIds();
  }, []);

  const handleDeviceInputChange = (event) => {
    const { id, value } = event.target;
    setDeviceData((prevData) => ({
      ...prevData,
      [id]: value,
    }));

    setDeviceErrors((prevErrors) => ({
      ...prevErrors,
      [id]: "", // Reset the error message for the current field
    }));
  };

  const validateDeviceData = () => {
    let errors = {};

    if (deviceData.deviceName.trim() === "") {
      errors.deviceName = "Device Name is required";
    } else {
      if (!deviceData.deviceName.match(/^[a-zA-Z0-9 ]*$/)) {
        errors.deviceName =
          "Device Name can only contain alphabets and numbers";
      }
    }

    if (deviceData.serialNumber.trim() === "") {
      errors.serialNumber = "Serial Number is required";
    } else {
      if (!deviceData.serialNumber.match(/^[a-zA-Z0-9]*$/)) {
        errors.serialNumber =
          "Serial Number can only contain alphabets and numbers";
      }
    }
    if (deviceData.gatewayId.trim() === "") {
      errors.gatewayId = "Gateway ID is required";
    }
    if (deviceData.model.trim() === "") {
      errors.model = "Model is required";
    } else {
      if (!deviceData.model.match(/^[a-zA-Z0-9. ]*$/)) {
        errors.model = "Model can only contain alphabets, numbers, and full stops";
      }
      
    }
    if (deviceData.manufacturer.trim() === "") {
      errors.manufacturer = "Manufacturer is required";
    }

    if (deviceData.firmwareVersion.trim() === "") {
      errors.firmwareVersion = "Firmware Version is required";
    }

    if (deviceData.manufacturingDate.trim() === "") {
      errors.manufacturingDate = "Manufacturing Date is required";
    }

    if (deviceData.purchaseDate.trim() === "") {
      errors.purchaseDate = "Purchase Date is required";
    }

    if (deviceData.warrantyExpiryDate.trim() === "") {
      errors.warrantyExpiryDate = "Warranty Expiry Date is required";
    }

    if (deviceData.additionalDetails.trim() === "") {
      errors.additionalDetails = "Additional Details are required";
    }

    if (deviceData.remarks.trim() === "") {
      errors.remarks = "Remarks are required";
    }

    return errors;
  };

  const handleAddDevice = async () => {
    const errors = validateDeviceData();
    if (Object.keys(errors).length === 0) {
      try {
        const response = await fetch("http://localhost:3001/addDevice", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(deviceData),
        });

        if (response.ok) {
          const result = await response.json();
          console.log(result.message);
          alert("Device added successfully");
          setDeviceData({});
        } else {
          const errorData = await response.json();
          console.error("Failed to add device:", errorData.message);
        }
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    } else {
      // Set errors to display in UI
      setDeviceErrors(errors);
    }
  };

  const dashboardClick = (event) => {
    event.preventDefault();
    navigate("/Dashboard");
  };

  const DeviceClick = (event) => {
    event.preventDefault();
    navigate("/Device/Device");
  };

  return (
    <Layout>
      <div className="dash-content">
        <div className="activity">
          <div className="breadcrumb-container">
            <h1 className="text">Add Device</h1>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
              <div className="container">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <i className="fas fa-tachometer-alt me-1" />
                      <Link onClick={dashboardClick}>Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <i className="fas fa-duotone fa-house-laptop me-1" />
                      <Link onClick={DeviceClick}>Device</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link className="active">Add Device</Link>
                    </li>
                  </ol>
                </nav>
              </div>
            </nav>
            <div className="card mt-3">
              <ul className="nav nav-tabs m-3" id="myTabs" role="tablist">
                <li className="nav-item" role="presentation">
                  <a
                    className="nav-link active"
                    id="Sensor-tab"
                    data-bs-toggle="tab"
                    href="#Sensor"
                    role="tab"
                    aria-controls="Sensor"
                    aria-selected="true"
                  >
                    Add Sensor
                  </a>
                </li>
                <li className="nav-item" role="presentation">
                  <a
                    className="nav-link"
                    id="gatway-tab"
                    data-bs-toggle="tab"
                    href="#gatway"
                    role="tab"
                    aria-controls="gatway"
                    aria-selected="false"
                  >
                    Add Device Getway
                  </a>
                </li>
                <li className="nav-item" role="presentation">
                  <a
                    className="nav-link"
                    id="device-tab"
                    data-bs-toggle="tab"
                    href="#device"
                    role="tab"
                    aria-controls="device"
                    aria-selected="false"
                  >
                    Register Device
                  </a>
                </li>
              </ul>

              <div className="tab-content">
                <div
                  className="tab-pane fade show active"
                  id="Sensor"
                  role="tabpanel"
                >
                  <div className="row m-4">
                    <div className="col-lg-12">
                      <div className="me-3 mb-4">
                        <h2 className="title">Sensor Detail</h2>
                        <div className="row ">
                          <div className="col-lg-12">
                            <h6 className="text-mute mt-4">Device Detail :</h6>
                            <hr />
                            <div className="row">
                              <div className="col-sm-3 mt-2">
                                <p className="mb-0">Sensor Name</p>
                              </div>
                              <div className="col-sm-9 mt-2">
                                <input
                                  type="text"
                                  id="sensorName"
                                  placeholder="Sensor Name"
                                  className="form-control"
                                  onChange={handleSensorInputChange}
                                />
                                {sensorErrors.sensorName && (
                                  <span className="text-danger">
                                    {sensorErrors.sensorName}
                                  </span>
                                )}
                              </div>

                              <div className="col-sm-3 mt-2">
                                <p className="mb-0">Sensor Calibration</p>
                              </div>
                              <div className="col-sm-9 mt-2">
                                <input
                                  type="text"
                                  id="sensorCalibration"
                                  placeholder="Sensor Calibration"
                                  className="form-control"
                                  onChange={handleSensorInputChange}
                                />
                                {sensorErrors.sensorCalibration && (
                                  <span className="text-danger">
                                    {sensorErrors.sensorCalibration}
                                  </span>
                                )}
                              </div>

                              <div className="col-sm-3 mt-2">
                                <p className="mb-0">Device Id</p>
                              </div>
                              <div className="col-sm-9 mt-2">
                                <select
                                  className="form-select"
                                  id="deviceId"
                                  aria-label="Default select example"
                                  value={sensorData.deviceId}
                                  onChange={handleSensorInputChange}
                                >
                                  <option value="" disabled>
                                    Select Device
                                  </option>
                                  {deviceDropdown.map((device) => (
                                    <option
                                      key={device.device_id}
                                      value={device.device_id}
                                    >
                                      {device.device_id}
                                    </option>
                                  ))}
                                </select>
                                {sensorErrors.deviceId && (
                                  <span className="text-danger">
                                    {sensorErrors.deviceId}
                                  </span>
                                )}
                              </div>

                              <div className="col-sm-3 mt-2">
                                <p className="mb-0">Device Name</p>
                              </div>
                              <div className="col-sm-9 mt-2">
                                <input
                                  type="text"
                                  id="deviceName"
                                  placeholder="Device Name"
                                  className="form-control"
                                  value={
                                    deviceDropdown.find(
                                      (device) =>
                                        device.device_id ===
                                        Number(sensorData.deviceId)
                                    )?.device_name || ""
                                  }
                                  disabled
                                />
                              </div>

                              <div className="col-sm-3 mt-2"></div>
                              <div className="col-sm-9 mt-4">
                                <button
                                  type="button"
                                  className="btn btn-outline-success"
                                  onClick={handleAddSensor}
                                >
                                  ADD Sensor
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="tab-pane fade" id="gatway" role="tabpanel">
                  <div className="row m-4">
                    <div className="col-lg-12 ">
                      <div className="me-3 mb-4">
                        <h2 className="title">Gateway Detail</h2>
                        <div className="row">
                          <div className="col-lg-12">
                            <h6 className="text-mute mt-4">Gateway Detail:</h6>
                            <hr />
                            <div className="row">
                              <div className="col-sm-3">
                                <p className="mb-0">Gateway Name</p>
                              </div>
                              <div className="col-sm-9">
                                <input
                                  type="text"
                                  id="gatewayName"
                                  placeholder="Gateway Name"
                                  className="form-control"
                                  onChange={handleGatewayInputChange}
                                />
                                {gatewayErrors.gatewayName && (
                                  <span className="text-danger">
                                    {gatewayErrors.gatewayName}
                                  </span>
                                )}
                              </div>

                              <div className="col-sm-3 mt-2">
                                <p className="mb-0">Customer Id</p>
                              </div>
                              <div className="col-sm-9 mt-2">
                                <select
                                  className="form-select"
                                  id="customerId"
                                  aria-label="Default select example"
                                  onChange={handleGatewayInputChange}
                                >
                                  <option value="" disabled>
                                    Select Customer ID
                                  </option>
                                  {customerDropdown.map((customer) => (
                                    <option
                                      key={customer.customer_id}
                                      value={customer.customer_id}
                                    >
                                      {customer.customer_id}
                                    </option>
                                  ))}
                                </select>
                                {gatewayErrors.customerId && (
                                  <span className="text-danger">
                                    {gatewayErrors.customerId}
                                  </span>
                                )}
                              </div>

                              <div className="col-sm-3 mt-2">
                                <p className="mb-0">Customer Name</p>
                              </div>
                              <div className="col-sm-9 mt-2">
                                <input
                                  type="text"
                                  id="customerName"
                                  placeholder="Customer Name"
                                  className="form-control"
                                  value={gatewayData.customerName}
                                  disabled
                                />
                              </div>

                              <div className="col-sm-3 mt-2"></div>
                              <div className="col-sm-9 mt-4">
                                <button
                                  type="button"
                                  className="btn btn-outline-success"
                                  onClick={handleAddGateway}
                                >
                                  ADD Gateway
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="tab-pane fade" id="device" role="tabpanel">
                  <div className="row m-4">
                    <div className="col-lg-12 ">
                      <div className="me-3 mb-4">
                        <h2 className="title">Register Device</h2>
                        <div className="row">
                          <h6 className="text-mute mt-4">Basic Detail:</h6>
                          <hr />
                          <div className="col-lg-12">
                            <div className="row">
                              <div className="col-sm-3">
                                <p className="mb-0">Device Name</p>
                              </div>
                              <div className="col-sm-9">
                                <input
                                  type="text"
                                  id="deviceName"
                                  placeholder="Device Name"
                                  className="form-control"
                                  onChange={handleDeviceInputChange}
                                  value={deviceData.deviceName}
                                />
                                {deviceErrors.deviceName && (
                                  <p className="text-danger">
                                    {deviceErrors.deviceName}
                                  </p>
                                )}
                              </div>

                              <div className="col-sm-3 mt-2">
                                <p className="mb-0">Gateway Id</p>
                              </div>
                              <div className="col-sm-9 mt-2">
                                <select
                                  className="form-select"
                                  id="gatewayId"
                                  aria-label="Default select example"
                                  onChange={handleDeviceInputChange}
                                  value={deviceData.gatewayId}
                                >
                                  <option value="" disabled>
                                    Select Gateway ID
                                  </option>
                                  {gatewayIds.map((gatewayId) => (
                                    <option key={gatewayId} value={gatewayId}>
                                      {gatewayId}
                                    </option>
                                  ))}
                                </select>
                                {deviceErrors.gatewayId && (
                                  <p className="text-danger">
                                    {deviceErrors.gatewayId}
                                  </p>
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
                                  onChange={handleDeviceInputChange}
                                  value={deviceData.manufacturer}
                                />
                                {deviceErrors.manufacturer && (
                                  <p className="text-danger">
                                    {deviceErrors.manufacturer}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <h6 className="text-mute mt-4">Device Detail:</h6>
                          <hr />
                          <div className="row">
                            <div className="col-sm-3">
                              <p className="mb-0">Model</p>
                            </div>
                            <div className="col-sm-9">
                              <input
                                type="text"
                                id="model"
                                placeholder="Model"
                                className="form-control"
                                onChange={handleDeviceInputChange}
                                value={deviceData.model}
                              />
                              {deviceErrors.model && (
                                <p className="text-danger">
                                  {deviceErrors.model}
                                </p>
                              )}
                            </div>

                            <div className="col-sm-3 mt-2">
                              <p className="mb-0">Serial Number</p>
                            </div>
                            <div className="col-sm-9 mt-2">
                              <input
                                type="text"
                                id="serialNumber"
                                placeholder="Serial Number"
                                className="form-control"
                                onChange={handleDeviceInputChange}
                                value={deviceData.serialNumber}
                              />
                              {deviceErrors.serialNumber && (
                                <p className="text-danger">
                                  {deviceErrors.serialNumber}
                                </p>
                              )}
                            </div>

                            <div className="col-sm-3 mt-2">
                              <p className="mb-0">Firmware Version</p>
                            </div>
                            <div className="col-sm-9 mt-2">
                              <input
                                type="text"
                                id="firmwareVersion"
                                placeholder="Firmware Version"
                                className="form-control"
                                onChange={handleDeviceInputChange}
                                value={deviceData.firmwareVersion}
                              />
                              {deviceErrors.firmwareVersion && (
                                <p className="text-danger">
                                  {deviceErrors.firmwareVersion}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <h6 className="text-mute mt-4">Warranty Detail:</h6>
                          <hr />
                          <div className="row">
                            <div className="col-sm-3">
                              <p className="mb-0">Manufacturing Date</p>
                            </div>
                            <div className="col-sm-9">
                              <input
                                type="date"
                                id="manufacturingDate"
                                className="form-control"
                                onChange={handleDeviceInputChange}
                                value={deviceData.manufacturingDate}
                              />
                              {deviceErrors.manufacturingDate && (
                                <p className="text-danger">
                                  {deviceErrors.manufacturingDate}
                                </p>
                              )}
                            </div>

                            <div className="col-sm-3 mt-2">
                              <p className="mb-0">Purchase Date</p>
                            </div>
                            <div className="col-sm-9 mt-2">
                              <input
                                type="date"
                                id="purchaseDate"
                                className="form-control"
                                onChange={handleDeviceInputChange}
                                value={deviceData.purchaseDate}
                              />
                              {deviceErrors.purchaseDate && (
                                <p className="text-danger">
                                  {deviceErrors.purchaseDate}
                                </p>
                              )}
                            </div>

                            <div className="col-sm-3 mt-2">
                              <p className="mb-0">Warranty expiry Date</p>
                            </div>
                            <div className="col-sm-9 mt-2">
                              <input
                                type="date"
                                id="warrantyExpiryDate"
                                className="form-control"
                                onChange={handleDeviceInputChange}
                                value={deviceData.warrantyExpiryDate}
                              />
                              {deviceErrors.warrantyExpiryDate && (
                                <p className="text-danger">
                                  {deviceErrors.warrantyExpiryDate}
                                </p>
                              )}
                            </div>

                            <div className="col-sm-3 mt-2">
                              <p className="mb-0">Additional Details</p>
                            </div>
                            <div className="col-sm-9 mt-2">
                              <textarea
                                type="text"
                                id="additionalDetails"
                                placeholder="Additional Details"
                                className="form-control"
                                rows="4"
                                onChange={handleDeviceInputChange}
                                value={deviceData.additionalDetails}
                              />
                              {deviceErrors.additionalDetails && (
                                <p className="text-danger">
                                  {deviceErrors.additionalDetails}
                                </p>
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
                                onChange={handleDeviceInputChange}
                                value={deviceData.remarks}
                              />
                              {deviceErrors.remarks && (
                                <p className="text-danger">
                                  {deviceErrors.remarks}
                                </p>
                              )}
                            </div>
                            <div className="col-sm-3 mt-2"></div>
                            <div className="col-sm-9 mt-4">
                              <button
                                type="button"
                                className="btn btn-outline-success"
                                onClick={handleAddDevice}
                              >
                                ADD Device
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
        </div>
      </div>
    </Layout>
  );
};

export default AddDevice;
