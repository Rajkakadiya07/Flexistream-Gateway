import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import $ from "jquery";
import "datatables.net";
import "datatables.net-bs5";

import Sidenav from "../Sidenav/Sidenav";

const DeviceMonitor = () => {
  const navigate = useNavigate();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("token", token);
        if (token !== null) {
          const response = await fetch("http://localhost:3001/devices", {
            method: "GET",
            headers: {
              Authorization: token,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setDevices(data);
            setLoading(false);
          } else {
            console.log("response", response);
            setDevices([]);
            setLoading(false);
          }
        } else {
          console.error("Token is null");
        }
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    };

    fetchDevices();
  }, []);

  useEffect(() => {
    // Initialize DataTable when the component mounts
    $("#example").DataTable();

    // Clean up DataTable instance when the component unmounts
    return () => {
      $("#example").DataTable().destroy();
    };
  }, [devices]);

  const backHome = () => {
    navigate("/Customer_dashboard");
  };

  const handleDeviceDetailsClick = (event, deviceId) => {
    event.preventDefault();
    navigate(`/DeviceDetails/${deviceId}`);
  };

  const handleLogClick = (event, deviceId) => {
    event.preventDefault();
    navigate(`/Log/${deviceId}`);
  };

  const handleMonitorDeviceClick = (event, deviceId) => {
    event.preventDefault();
    navigate(`/Monitor/${deviceId}`);
  };
  
  

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
                      <span>Device Monitor</span>
                    </li>
                  </ol>
                </nav>
              </div>
            </nav>
          </div>
          <div className="col-lg-12 mt-3">
            <div className="card mb-4">
              <div className="card-body">
                <ul className="nav nav-tabs" id="myTabs" role="tablist">
                  <li className="nav-item" role="presentation">
                    <a
                      className="nav-link active"
                      id="dMonitor-tab"
                      data-bs-toggle="tab"
                      href="#dMonitor"
                      role="tab"
                      aria-controls="dMonitor"
                      aria-selected="true"
                    >
                      Monitor Device
                    </a>
                  </li>
                  <li className="nav-item" role="presentation">
                    <a
                      className="nav-link"
                      id="log-tab"
                      data-bs-toggle="tab"
                      href="#log"
                      role="tab"
                      aria-controls="log"
                      aria-selected="false"
                    >
                      Log details
                    </a>
                  </li>
                </ul>
                <div className="tab-content">
                  <div
                    className="tab-pane fade show active"
                    id="dMonitor"
                    role="tabpanel"
                  >
                    <div className="row">
                      <div className="col-lg-12 ">
                        <div
                          className="mt-4"
                          style={{ borderRadius: 10, maxWidth: "100%" }}
                        >
                          <div className="card-body">
                            <div className="table-responsive">
                              <table
                                id="device-monitor-table"
                                className="table table-striped table-sm"
                                cellSpacing="0"
                                width="100%"
                              >
                                {/* Table header */}
                                <thead>
                                  <tr>
                                    <th>No.</th>
                                    <th>Device ID</th>
                                    <th>Device Name</th>
                                    <th>Action</th>
                                  </tr>
                                </thead>
                                {/* Table body */}
                                <tbody>
                                  {/* Render table rows dynamically */}
                                  {loading ? (
                                    <tr>
                                      <td colSpan="4">Loading...</td>
                                    </tr>
                                  ) : devices.length === 0 ? (
                                    <tr>
                                      <td colSpan="4">No data available</td>
                                    </tr>
                                  ) : (
                                    devices.map((device, index) => (
                                      <tr key={device.device_id}>
                                        <td>{index + 1}</td>
                                        <td>{device.device_id}</td>
                                        <td>{device.device_name}</td>
                                        <td className="d-flex">
                                          <button
                                            className="btn btn-primary me-2"
                                            onClick={(event) =>
                                              handleMonitorDeviceClick(
                                                event,
                                                device.device_id
                                              )
                                            }
                                          >
                                            Monitor Device
                                          </button>
                                        </td>
                                      </tr>
                                    ))
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane fade" id="log" role="tabpanel">
                    <div
                      className="mt-4"
                      style={{ borderRadius: 10, maxWidth: "100%" }}
                    >
                      <div className="card-body">
                        {loading ? (
                          <p>Loading...</p>
                        ) : (
                          <div className="table-responsive">
                            <table
                              id="log-details-table"
                              className="table table-striped table-sm"
                              cellSpacing="0"
                              width="100%"
                            >
                              <thead>
                                <tr>
                                  <th>No.</th>
                                  <th>Device Name</th>
                                  <th>Manufacturer</th>
                                  <th>Model</th>
                                  <th>Serial Number</th>
                                  <th>Action</th>
                                </tr>
                              </thead>

                              <tbody>
                                {devices.map((device, index) => (
                                  <tr key={device.device_id}>
                                    <td>{index + 1}</td>
                                    <td>{device.device_name}</td>
                                    <td>{device.manufacturer}</td>
                                    <td>{device.model}</td>
                                    <td>{device.serial_number}</td>
                                    <td className="d-flex">
                                      <button
                                        className="btn btn-primary me-2"
                                        onClick={(event) =>
                                          handleDeviceDetailsClick(
                                            event,
                                            device.device_id
                                          )
                                        }
                                      >
                                        View
                                      </button>
                                      <button
                                        className="btn btn-dark"
                                        onClick={(event) =>
                                          handleLogClick(
                                            event,
                                            device.device_id
                                          )
                                        }
                                      >
                                        Log Details
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="tab-pane fade" id="log" role="tabpanel">
                    <div
                      className=" mt-4"
                      style={{ borderRadius: 10, maxWidth: "100%" }}
                    >
                      <div className="card-body">
                        {loading ? (
                          <p>Loading...</p>
                        ) : (
                          <div className="table-responsive">
                            <table
                              id="example"
                              className="table table-striped table-sm"
                              cellSpacing="0"
                              width="100%"
                            >
                              <thead>
                                <tr>
                                  <th>No.</th>
                                  <th>Device Name</th>
                                  <th>Manufacturer</th>
                                  <th>Model</th>
                                  <th>Serial Number</th>
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {devices.map((device, index) => (
                                  <tr key={device.device_id}>
                                    <td>{index + 1}</td>
                                    <td>{device.device_name}</td>
                                    <td>{device.manufacturer}</td>
                                    <td>{device.model}</td>
                                    <td>{device.serial_number}</td>
                                    <td className="d-flex">
                                      <button
                                        className="btn btn-primary me-2"
                                        onClick={(event) =>
                                          handleDeviceDetailsClick(
                                            event,
                                            device.device_id
                                          )
                                        }
                                      >
                                        View
                                      </button>
                                      <button
                                        className="btn btn-dark"
                                        onClick={(event) =>
                                          handleLogClick(
                                            event,
                                            device.device_id
                                          )
                                        }
                                      >
                                        Log Details
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
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
    </Sidenav>
  );
};

export default DeviceMonitor;
