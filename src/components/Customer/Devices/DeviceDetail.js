import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Devices = () => {
  const [devices, setDevices] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const navigate = useNavigate();
  const backHome = () => {
    navigate("/");
  };

  const handleDeviceDetail = (event) => {
    event.preventDefault();
    navigate("/DeviceDetail");
  };

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3001/devices");
      if (!response.ok) {
        throw new Error("Failed to fetch device data");
      }
      const data = await response.json();
      setDevices(data);
    } catch (error) {
      console.error("Error fetching device data:", error);
      setError("Failed to fetch device data. Please try again.");
    }
  };

  return (
    <div className="container-xxl mt-4">
      <div className="bg-body-tertiary">
        <nav
          data-mdb-navbar-init
          className="navbar navbar-expand-lg bg-body-tertiary"
        >
          <div className="container-fluid">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link onClick={backHome}>Home</Link>
                </li>
                <li className="breadcrumb-item active">Devices</li>
              </ol>
            </nav>
          </div>
        </nav>
        {error ? (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        ) : (
          <div className="row">
            <div className="container-xxl">
              <p className="ms-1 mt-3">
                <b>Results</b>
              </p>
              <div className="row">
                {devices.map((device) => (
                  <div className="col-md-3" key={device.selling_id}>
                    <section className="mb-3" style={{ maxWidth: "16rem" }}>
                      <div className="card">
                        <div className="bg-image hover-overlay ripple">
                          <Link
                            to="/DeviceDetail"
                            className="card-text"
                            onClick={handleDeviceDetail}
                          >
                            <img
                              src={`data:image/jpeg;base64,${device.image_data}`}
                              className="card-img-top"
                              alt={device.device_name}
                            />
                          </Link>
                        </div>
                        <div className="card-body">
                          <h5 className="card-title font-weight-bold">
                            {device.device_name}
                          </h5>
                          <p className="card-text">{device.description}</p>
                          <ul className="list-unstyled list-inline mb-0">
                            <li className="list-inline-item me-0">
                              <i className="fas fa-star text-warning"></i>
                            </li>
                            {/* Add your rating stars here */}
                          </ul>
                          <h3 className="mb-2">Price: ${device.price}</h3>
                          <p className="card-text">
                            Get it by Today, 25 January FREE Delivery by
                            Amazon
                          </p>
                        </div>
                      </div>
                    </section>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Devices;