import React, { useState, useEffect } from "react";
import Sidenav from "./Sidenav/Sidenav";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Link } from "react-router-dom";
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">Temperature: {payload[0].value}</p>
        <p className="label">Time: {payload[0].payload.timestamp}</p>
      </div>
    );
  }

  return null;
};

const Customer_dashboard = () => {
  const [deviceCount, setDeviceCount] = useState(0);
  const [gatewayCount, setGatewayCount] = useState(0);
  const [temperatureData, setTemperatureData] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    const fetchCustomerInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3001/customer-info", {
          headers: {
            Authorization: token,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setDeviceCount(data.deviceCount);
          setGatewayCount(data.gatewayCount);
        } else {
          throw new Error("Failed to fetch customer information");
        }
      } catch (error) {
        console.error("Error fetching customer information:", error);
      }
    };

    fetchCustomerInfo();
  }, []);

  useEffect(() => {
    const fetchTemperatureData = async () => {
      try {
        const token = localStorage.getItem("token");

        let url = "http://localhost:3001/temperature-data";
        if (selectedDevice) {
          url += `?deviceId=${selectedDevice}`;
        }
        const response = await fetch(url, {
          headers: {
            Authorization: token,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setTemperatureData(data);
        } else {
          throw new Error("Failed to fetch temperature data");
        }
      } catch (error) {
        console.error("Error fetching temperature data:", error);
      }
    };

    const interval = setInterval(fetchTemperatureData, 1000); // Fetch temperature data every second

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [selectedDevice]);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3001/devices", {
          headers: {
            Authorization: token,
          },
        });
        if (response.ok) {
          const data = await response.json();
          console.log("Devices:", data);
          setDevices(data);
        } else {
          throw new Error("Failed to fetch devices");
        }
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    };

    fetchDevices();
  }, []);

  const handleDeviceSelect = (deviceId) => {
    setSelectedDevice(deviceId);
  };

  return (
    <Sidenav>
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
                      <a href="/">Dashboard</a>
                    </li>
                  </ol>
                </nav>
              </div>
            </nav>
          </div>
          <div className="row mt-4">
            <div className="col-md-6">
              <div className="card bg-info text-white">
                <div className="card-body">
                  <h5 className="card-title">Devices</h5>
                  <p className="card-text">{deviceCount}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card bg-danger text-white">
                <div className="card-body">
                  <h5 className="card-title">Gateways</h5>
                  <p className="card-text">{gatewayCount}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-4">
            <div className="card p-4 col-md-12 m-2">
              <h3>Real-time Temperature Chart</h3>
              <div className="col-md-4 mb-3">
                <label>Select Device: </label>
                <select
                  onChange={(e) => handleDeviceSelect(e.target.value)}
                  className="form-select col-3"
                >
                  <option value="">All Devices</option>
                  {/* Render options for each device */}
                  {devices.map((device) => (
                    <option key={device.device_id} value={device.device_id}>
                      {device.device_name}
                    </option>
                  ))}
                </select>
              </div>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={temperatureData}>
                  <XAxis dataKey="index" />
                  <YAxis ticks={[-10, 0, 10, 20, 30, 40, 50, 60]} />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </Sidenav>
  );
};

export default Customer_dashboard;
