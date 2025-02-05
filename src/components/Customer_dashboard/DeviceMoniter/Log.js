import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidenav from "../Sidenav/Sidenav";
import DataTable from "react-data-table-component";

const Log = () => {
  const [logDetails, setLogDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchLogData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/logs/${id}`);
        setLogDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching log data:", error);
        setError("Error fetching log data. Please try again later.");
        setLoading(false);
      }
    };

    fetchLogData();
  }, [id]);

  const backHome = () => {
    navigate("/");
  };

  const DeviceMoniterClick = (event) => {
    event.preventDefault();
    navigate("/DeviceMoniter");
  };

  const columns = [
    {
      name: "No",
      selector: (row, index) => index + 1,
      sortable: true,
      width: "50px", // Adjust the width of this column
    },
    {
      name: "Log Detail ID",
      selector: (row) => row["Log Detail ID"],
      sortable: true,
    },
    {
      name: "Log ID",
      selector: (row) => row["Log ID"],
      sortable: true,
    },
    {
      name: "Timestamp",
      selector: (row) => row["Timestamp"],
      sortable: true,
      width: "200px", // Adjust the width of this column
    },
    {
      name: "Log Data",
      selector: (row) => row["Log Data"],
      sortable: true,
      wrap: true, // Enable text wrapping for this column
    },
  ];

  return (
    <Sidenav>
      <div className="dashboard-content">
        <div className="overview">
          <div className="breadcrumb-container">
            <h1 className="text">Log</h1>
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
                      <Link>Log</Link>
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
                        data={logDetails}
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

export default Log;
