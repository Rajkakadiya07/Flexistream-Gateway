import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Layout from "../Layout/Layout";
import { Link, useNavigate } from "react-router-dom";

const UpdateSensor = () => {
  const { id } = useParams();
  const [sensor, setSensor] = useState({
    sensor_name: "",
    sensor_calibration_value: "",
    device_id: "",
    device_name: "",
    // Add other fields here if necessary
  });
  const [devices, setDevices] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSensor = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/admin/sensors/${id}`
        );
        setSensor(response.data);
      } catch (error) {
        console.error("Error fetching sensor:", error);
      }
    };
    fetchSensor();

    const fetchDevices = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/admin/devices"
        );
        setDevices(response.data);
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    };
    fetchDevices();
  }, [id]);

  useEffect(() => {
    const fetchDeviceName = async () => {
      try {
        const deviceResponse = await axios.get(
          `http://localhost:3001/admin/devices/${sensor.device_id}`
        );
        // Update the device name in the sensor state
        setSensor((prevState) => ({
          ...prevState,
          device_name: deviceResponse.data.device_name,
        }));
      } catch (error) {
        console.error("Error fetching device details:", error);
      }
    };

    // Fetch device name when the device ID changes
    if (sensor.device_id) {
      fetchDeviceName();
    }
  }, [sensor.device_id]);

  const handleUpdate = async () => {
    // Validate input fields
    if (!validateInputs()) {
      return;
    }

    if (window.confirm("Are you sure you want to update this sensor?")) {
      try {
        await axios.put(
          `http://localhost:3001/admin/sensors/${id}`,
          sensor
        );
        alert("Sensor updated successfully");
        navigate(`/Sensor/sensor`); // Navigate to the sensor page
      } catch (error) {
        console.error("Error updating sensor:", error);
        alert("Failed to update sensor");
      }
    }
  };

  const validateInputs = () => {
    let valid = true;
    let errorsCopy = {};

    // Check if sensor name is empty or contains invalid characters
    if (sensor.sensor_name.trim() === "") {
      errorsCopy.sensor_name = "Sensor name cannot be empty";
      valid = false;
    } else if (!sensor.sensor_name.trim().match(/^[a-zA-Z0-9\s]+$/)) {
      errorsCopy.sensor_name =
        "Sensor name should only contain alphabets, numbers, and spaces";
      valid = false;
    }
    
    // Check if sensor calibration value is empty or not a valid float
    if (sensor.sensor_calibration_value.trim() === "") {
      errorsCopy.sensor_calibration_value = "Sensor calibration value cannot be empty";
      valid = false;
    } else if (
      !sensor.sensor_calibration_value.trim().match(/^-?\d*(\.\d+)?$/) ||
      isNaN(parseFloat(sensor.sensor_calibration_value))
    ) {
      errorsCopy.sensor_calibration_value =
        "Sensor calibration value should be a valid floating-point number";
      valid = false;
    }
    

    // Check if any device is selected
    if (!sensor.device_id) {
      errorsCopy.device_id = "Please select a device";
      valid = false;
    }

    setErrors(errorsCopy);
    return valid;
  };

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setSensor({ ...sensor, [id]: value });
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
                      <Link to="/Dashboard">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <i className="fas fa-users me-1" />
                      <Link to="/Sensor/sensor" className="active">
                        Update Sensor
                      </Link>
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
                  <h2 className="title">Update Sensor</h2>
                  <div className="row ">
                    <h6 className="text-mute mt-4 ">Basic Detail :</h6>
                    <hr />
                    <div className="col-lg-12">
                      <div className="row ">
                        <div className="col-sm-3">
                          <p className="mb-0 ">Sensor Name</p>
                        </div>
                        <div className="col-sm-9">
                          <input
                            type="text"
                            id="sensor_name"
                            placeholder="Sensor Name"
                            className="form-control"
                            value={sensor.sensor_name || ""}
                            onChange={handleInputChange}
                          />
                          {errors.sensor_name && (
                            <div className="text-danger">
                              {errors.sensor_name}
                            </div>
                          )}
                        </div>

                        <div className="col-sm-3 mt-2">
                          <p className="mb-0">Sensor Calibration Value</p>
                        </div>
                        <div className="col-sm-9 mt-2">
                          <input
                            type="text"
                            id="sensor_calibration_value"
                            placeholder="Sensor Calibration Value"
                            className="form-control"
                            value={sensor.sensor_calibration_value || ""}
                            onChange={handleInputChange}
                          />
                          {errors.sensor_calibration_value && (
                            <div className="text-danger">
                              {errors.sensor_calibration_value}
                            </div>
                          )}
                        </div>

                        <div className="col-sm-3 mt-2">
                          <p className="mb-0">Device ID</p>
                        </div>
                        <div className="col-sm-9 mt-2">
                          <select
                            className="form-select"
                            id="device_id"
                            aria-label="Default select example"
                            value={sensor.device_id || ""}
                            onChange={handleInputChange}
                          >
                            <option value="" disabled>
                              Select Device ID
                            </option>
                            {devices.map((device) => (
                              <option
                                key={device.device_id}
                                value={device.device_id}
                              >
                                {device.device_id}
                              </option>
                            ))}
                          </select>
                          {errors.device_id && (
                            <div className="text-danger">
                              {errors.device_id}
                            </div>
                          )}
                        </div>

                        <div className="col-sm-3 mt-2">
                          <p className="mb-0">Device Name</p>
                        </div>
                        <div className="col-sm-9 mt-2">
                          <input
                            type="text"
                            id="device_name"
                            placeholder="Device Name"
                            className="form-control"
                            value={sensor.device_name || ""}
                            onChange={handleInputChange}
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    {/* Add other sensor details here if necessary */}
                    <div className="col-sm-3 mt-2"></div>
                    <div className="col-sm-9 mt-4">
                      <button
                        type="button"
                        className="btn btn-outline-success "
                        onClick={handleUpdate}
                      >
                        Update Sensor
                      </button>
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

export default UpdateSensor;
