import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Sidenav from "../Sidenav/Sidenav";
import DataTable from "react-data-table-component";

const Monitor = () => {
  const { deviceId } = useParams();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/log-iotdevice/${deviceId}`);
        setLogs(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching logs:", error);
        setError("Error fetching log data. Please try again later.");
        setLoading(false);
      }
    };
  
    const interval = setInterval(fetchLogs, 3000); // Fetch logs every 3 seconds
  
    // Cleanup function to clear the interval when the component unmounts or the dependency changes
    return () => clearInterval(interval);
  }, [deviceId]); // Dependency array to run effect when deviceId changes
  

  const backHome = () => {
    navigate("/Customer_dashboard");
  };

  const DeviceMoniterClick = (event) => {
    event.preventDefault();
    navigate("/DeviceMoniter");
  };

  const columns = [
    {
      name: "Device ID",
      selector: (row) => row.device_id,
      sortable: true,
    },
    {
      name: "Timestamp",
      selector: (row) => row.timestamp,
      sortable: true,
    },
    {
      name: "Device Name",
      selector: (row) => row.device_name,
      sortable: true,
    },
    {
      name: "Log Data",
      selector: (row) => row.log_data,
      sortable: true,
      wrap: true,
    },
  ];

  return (
    <Sidenav>
      <div className="dashboard-content">
        <div className="overview">
          <div className="breadcrumb-container">
            <h1 className="text">Device Monitor</h1>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
              <div className="container">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <i className="fas fa-tachometer-alt me-1" />
                      <Link onClick={backHome}>Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <i className="fas fa-duotone fa-house-laptop fa-fw me-1" />
                      <Link onClick={DeviceMoniterClick}>Device Moniter</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <i className="fab fa-blogger-b me-1"></i>
                      <span>Moniter Device</span>
                    </li>
                  </ol>
                </nav>
              </div>
            </nav>
          </div>
          <div className=" mt-4">
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title">Log Details</h5>
                  </div>
                  <div className="card-body">
                    {loading ? (
                      <p>Loading...</p>
                    ) : error ? (
                      <p>{error}</p>
                    ) : (
                      <DataTable
                        columns={columns}
                        data={logs}
                        pagination
                      />
                    )}
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

export default Monitor;
