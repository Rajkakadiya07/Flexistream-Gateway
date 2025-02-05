import React, { useState, useEffect } from "react";
import Layout from "../Layout/Layout";
import { Link } from "react-router-dom";

const Sensor = () => {
  const [sensors, setSensors] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSensorData();
  }, []);

  const fetchSensorData = async () => {
    try {
      const response = await fetch("http://localhost:3001/admin/sensors");
      if (!response.ok) {
        throw new Error("Failed to fetch sensor data");
      }
      const data = await response.json();
      setSensors(data);
    } catch (error) {
      console.error("Error fetching sensors:", error);
      setError(error.message);
    }
  };

  const handleDeleteSensor = async (sensorId) => {
    if (window.confirm("Are you sure you want to delete this sensor?")) {
      try {
        const response = await fetch(`http://localhost:3001/admin/sensors/${sensorId}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Failed to delete sensor");
        }
        // Update sensors state to reflect the deletion
        alert("Sensor deleted successfully");
        setSensors(sensors.filter(sensor => sensor.sensor_id !== sensorId));
      } catch (error) {
        console.error("Error deleting sensor:", error);
        setError(error.message);
      }
    }
  };

  return (
    <Layout>
      <div className="dash-content">
        <div className="activity">
          <div className="breadcrumb-container">
            <h1 className="text">Sensors</h1>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
              <div className="container">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <i className="fas fa-tachometer-alt me-1" />
                      <Link to="/Dashboard">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <i className="fas fa-house-laptop"></i>
                      <span className="active">Sensors</span>
                    </li>
                  </ol>
                </nav>
              </div>
            </nav>
          </div>
          <div className="mt-4">
            {error ? (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            ) : (
              <div className="card">
                <div className="card-header">
                  <h5>Sensors</h5>
                </div>
                <div className="card-body">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Sensor ID</th>
                        <th>Sensor Name</th>
                        <th>Sensor Calibration Value</th>
                        <th>Device ID</th>
                        <th>Device Name</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sensors.map((sensor) => (
                        <tr key={sensor.sensor_id}>
                          <td>{sensor.sensor_id}</td>
                          <td>{sensor.sensor_name}</td>
                          <td>{sensor.sensor_calibration_value}</td>
                          <td>{sensor.device_id}</td>
                          <td>{sensor.device_name}</td>
                          <td className="d-flex">
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDeleteSensor(sensor.sensor_id)}
                            >
                              <i className="fas fa-trash" />
                            </button>
                            <Link
                              className="btn btn-success btn-sm ms-1"
                              to={`/UpdateSensor/${sensor.sensor_id}`}
                            >
                              <i className="far fa-edit" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Sensor;
