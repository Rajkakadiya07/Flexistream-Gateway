import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidenav from "../Sidenav/Sidenav";

const DeviceDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [device, setDevice] = useState(null);

  useEffect(() => {
    const fetchDevice = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/devices/${id}`);
        setDevice(response.data); // Set the fetched device data to state
      } catch (error) {
        console.error("Error fetching device:", error);
        setDevice(null); // Clear the device data in case of an error
      }
    };
    fetchDevice();
  }, [id]);

  const backHome = () => {
    window.location.href = "/";
  };

  const DeviceMoniterClick = (event) => {
    event.preventDefault();
    navigate("/DeviceMoniter");
  };

  return (
    <Sidenav>
      <div className="dashboard-content">
        <div className="overview">
          <div className="breadcrumb-container">
            <h1 className="text">Device Details</h1>
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
                      <i class="fas fa-note-sticky me-1" />
                      <Link to={`/DeviceDetails/${id}`}>
                        Device Details
                      </Link>{" "}
                      {/* Link to the same page, you might want to change it */}
                    </li>
                  </ol>
                </nav>
              </div>
            </nav>
          </div>

          {device ? (
            <div className="mt-4">
              <div className="card">
                <div className="card-body table-responsive ">
                  <h5 className="card-title">Device Information</h5>
                  <table className="table table-bordered border-dark mt-4">
                    <tbody>
                      <tr>
                        <th scope="row">Device Name</th>
                        <td>{device.device_name}</td>
                      </tr>
                      <tr>
                        <th scope="row">Manufacturer</th>
                        <td>{device.manufacturer}</td>
                      </tr>
                      <tr>
                        <th scope="row">Model</th>
                        <td>{device.model}</td>
                      </tr>
                      <tr>
                        <th scope="row">Serial Number</th>
                        <td>{device.serial_number}</td>
                      </tr>
                      <tr>
                        <th scope="row">Firmware Version</th>
                        <td>{device.firmware_version}</td>
                      </tr>
                      <tr>
                        <th scope="row">Manufacturing Date</th>
                        <td>{device.manufacturing_date}</td>
                      </tr>
                      <tr>
                        <th scope="row">Purchase Date</th>
                        <td>{device.purchase_date}</td>
                      </tr>
                      <tr>
                        <th scope="row">Warranty Expiry Date</th>
                        <td>{device.warranty_expiry_date}</td>
                      </tr>
                      <tr>
                        <th scope="row">Additional Details</th>
                        <td>{device.additional_details}</td>
                      </tr>
                      <tr>
                        <th scope="row">Remarks</th>
                        <td>{device.remarks}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <p className="mt-4">Loading device details...</p>
          )}
        </div>
      </div>
    </Sidenav>
  );
};

export default DeviceDetails;
