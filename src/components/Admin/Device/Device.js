import React, { useEffect, useState } from "react";
import Layout from "../Layout/Layout";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Device = () => {
  const navigate = useNavigate();
  const [devices, setDevices] = useState([]);
  const [bulkFile, setBulkFile] = useState(null);

  const fetchDevices = async () => {
    try {
      const response = await axios.get("http://localhost:3001/admin/devices");
      setDevices(response.data);
    } catch (error) {
      console.error("Error fetching devices:", error);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const addDeviceClick = (event) => {
    event.preventDefault();
    navigate("/Device/addDevice");
  };

  const handleBulkFileChange = (event) => {
    setBulkFile(event.target.files[0]);
  };

  const bulkImportClick = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("file", bulkFile);

      await axios.post("http://localhost:3001/bulkImport", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Bulk import successful");
      alert("Bulk import successful");
      fetchDevices();
    } catch (error) {
      console.error("Error during bulk import:", error);
      alert("Bulk import Failed due to formet mismatched ");
    }
  };

  const deleteDevice = async (deviceId) => {
    // Ask for confirmation before deleting the device
    if (window.confirm("Are you sure you want to delete this device?")) {
      try {
        const response = await axios.delete(
          `http://localhost:3001/admin/devices/${deviceId}`
        );
        if (response.status === 200) {
          alert("Device deleted successfully");
          fetchDevices();
        }
      } catch (error) {
        console.error("Error deleting device:", error);
        alert("Failed to delete device");
      }
    }
  };

  return (
    <Layout>
      <div className="dash-content">
        <div className="activity">
          <div className="breadcrumb-container">
            <h1 className="text">Device</h1>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
              <div className="container">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <i className="fas fa-tachometer-alt me-1" />
                      <Link to="/Dashboard">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <i className="fas fa-duotone fa-house-laptop me-1" />
                      <span className="active">Device</span>
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
              <div
                className="card-header"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  border: "none",
                }}
              >
                <h5 className="ms-3" style={{ margin: 0 }}>
                  Devices Details
                </h5>
                <div className="d-flex align-items-center">
                  <div className="me-2">
                    <input
                      className="form-control mt-2"
                      type="file"
                      onChange={handleBulkFileChange}
                    />
                  </div>
                  <button
                    className="btn btn-primary mt-2"
                    onClick={bulkImportClick}
                    style={{
                      borderRadius: 20,
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    Bulk Import
                  </button>
                  <Link
                    className="btn btn-primary mt-2 ms-2"
                    onClick={addDeviceClick}
                    style={{
                      borderRadius: 20,
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    <i className="uil uil-plus" />
                    Add Device
                  </Link>
                </div>
              </div>
              <hr className="text-dark" />
              <div className="card-body">
                <div className="table-responsive">
                  <table
                    id="example"
                    className="table table-striped"
                    style={{ width: "100%" }}
                  >
                    <thead>
                      <tr>
                        <th>Device Name</th>
                        <th>Manufacturer</th>
                        <th>Model</th>
                        <th>Serial Number</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {devices.map((device) => (
                        <tr key={device.device_id}>
                          <td>{device.device_name}</td>
                          <td>{device.manufacturer}</td>
                          <td>{device.model}</td>
                          <td>{device.serial_number}</td>
                          <td className="d-flex">
                            <Link
                           className="btn btn-danger btn-sm"
                              onClick={() => deleteDevice(device.device_id)}
                            >
                              <i className="fas fa-trash" />
                            </Link>
                            <Link
                             className="btn btn-success btn-sm ms-1"
                              to={`/Device/updateDevice/${device.device_id}`}
                            >
                             <i className="far fa-pen-to-square" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Device;
