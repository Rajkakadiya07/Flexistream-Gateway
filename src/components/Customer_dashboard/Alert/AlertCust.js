import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidenav from "../Sidenav/Sidenav";

const AlertCust = () => {
  const navigate = useNavigate();
  const [devices, setDevices] = useState([]);
  const [formData, setFormData] = useState({
    maxTemp: "",
    minTemp: "",
    device_id: "", // Updated to device_id
  });
  const [alerts, setAlerts] = useState([]); // State variable to store alerts

  const { maxTemp, minTemp, device_id } = formData;

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await axios.get("http://localhost:3001/devices");
        setDevices(response.data || []);
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    };

    const fetchAlerts = async () => {
      try {
        const response = await axios.get("http://localhost:3001/alerts");
        setAlerts(response.data || []);
      } catch (error) {
        console.error("Error fetching alerts:", error);
      }
    };

    fetchDevices();
    fetchAlerts(); // Fetch alerts when the component mounts
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3001/submit-alert",
        formData
      );
      console.log("Alert submitted successfully:", response.data);
      // After successfully submitting the alert, fetch the updated alerts
      const updatedAlerts = await axios.get("http://localhost:3001/alerts");
      setAlerts(updatedAlerts.data || []);
    } catch (error) {
      console.error("Error submitting alert:", error);
    }
  };

  const backHome = () => {
    navigate("/Customer_dashboard");
  };

  return (
    <Sidenav>
      <div className="dashboard-content">
        <div className="overview">
          <div className="breadcrumb-container">
            <h1 className="text">Alerts & Notifications</h1>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
              <div className="container">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <i className="fas fa-tachometer-alt me-1" />
                      <span onClick={backHome}>Dashboard</span>
                    </li>
                    <li className="breadcrumb-item">
                      <i className="fas fa-solid fa-bell fa-fw me-1"></i>
                      <span>Alert & Notifications</span>
                    </li>
                  </ol>
                </nav>
              </div>
            </nav>
          </div>
          <div className="mt-4">
            <div
              className="card"
              style={{ borderRadius: 10, maxWidth: "100%" }}
            >
              <div className="card-header">
                <div className="row">
                  <form onSubmit={handleSubmit}>
                    <div className="row justify-content-center mt-3">
                      <div className="col-md-3 mt-4">
                        <label className="ms-2 form-label text-dark">
                          Max Temperature:
                          <input
                            type="number"
                            name="maxTemp"
                            placeholder="00.00"
                            value={maxTemp}
                            onChange={handleInputChange}
                            className="form-control"
                          />
                        </label>
                      </div>
                      <div className="col-md-3 mt-4">
                        <label className="ms-2 form-label text-dark">
                          Min Temperature:
                          <input
                            type="number"
                            name="minTemp"
                            placeholder="00.00"
                            value={minTemp}
                            onChange={handleInputChange}
                            className="form-control"
                          />
                        </label>
                      </div>
                      <div className="col-md-3 mt-3">
                        <label className="ms-2 form-label text-dark">
                          Device:
                          <select
                            name="device_id"
                            value={device_id}
                            onChange={handleInputChange}
                            className="form-select mt-1"
                          >
                            <option value="">Select</option>
                            {devices.map((device) => (
                              <option
                                key={device.device_id}
                                value={device.device_id}
                              >
                                {device.device_name}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                      <div className="col-md-2 mt-4">
                        <button
                          type="submit"
                          name="tps"
                          className="btn btn-primary mt-4"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <hr className="text-dark" />
              <div className=" ms-5 me-5 card-body">
                <h2>Set Alerts</h2>
                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>Max Temperature</th>
                      <th>Min Temperature</th>
                      <th>Device ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Map through alerts and display them in rows */}
                    {alerts.map((alert) => (
                      <tr key={alert.id}>
                        <td>{alert.max_temp}</td>
                        <td>{alert.min_temp}</td>
                        <td>{alert.device_id}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Sidenav>
  );
};

export default AlertCust;
