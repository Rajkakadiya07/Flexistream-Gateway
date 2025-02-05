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
    window.location.href = "/";
  };

  const DeviceDetail = (event) => {
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
                <li className="breadcrumb-item active">
                  <Link className="breadcrumb-item active">Devices</Link>
                </li>
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
                          <Link onClick={DeviceDetail} className="card-text">
                            <img
                              src={`data:image/jpeg;base64,${device.imagedata}`}
                              className="card-img-top"
                              alt={device.device_name}
                            />
                          </Link>
                        </div>
                        <div className="card-body">
                          <h5 className="card-title font-weight-bold">
                            <Link>{device.device_name}</Link>
                          </h5>
                          <Link onClick={DeviceDetail} className="card-text">
                            {device.description}
                          </Link>
                          <ul className="list-unstyled list-inline mb-0">
                            <li className="list-inline-item me-0">
                              <i className="fas fa-star text-warning"> </i>
                            </li>
                            <li className="list-inline-item me-0">
                              <i className="fas fa-star text-warning" />
                            </li>
                            <li className="list-inline-item me-0">
                              <i className="fas fa-star text-warning" />
                            </li>
                            <li className="list-inline-item me-0">
                              <i className="fas fa-star text-warning" />
                            </li>
                            <li className="list-inline-item">
                              <i className="fas fa-star-half-alt text-warning" />
                            </li>
                            <li className="list-inline-item">
                              <p className="text-muted">4.5 (413)</p>
                            </li>
                          </ul>
                          <h3 className="mb-2">Price: ${device.price}</h3>
                          <p className="card-text">
                            Get it by Today, 25 January FREE Delivery by Amazon
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