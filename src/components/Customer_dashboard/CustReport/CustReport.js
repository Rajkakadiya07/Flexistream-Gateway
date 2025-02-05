import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidenav from "../Sidenav/Sidenav";

const CustReport = () => {
  const navigate = useNavigate();

  const backHome = () => {
    navigate("/Customer_dashboard");
  };

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportType, setReportType] = useState("");
  const [reportData, setReportData] = useState([]);
  const [submitted, setSubmitted] = useState(false); // Track form submission

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true); // Update submitted state

    // Check if any of the fields are empty or end date is less than start date
    if (
      !startDate ||
      !endDate ||
      !reportType ||
      new Date(endDate) < new Date(startDate)
    ) {
      return; // Return early if validation fails
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/generateReport",
        {
          startDate,
          endDate,
          reportType,
        }
      );
      setReportData(response.data.data);
    } catch (error) {
      console.error("Error fetching report data:", error);
    }
  };

  return (
    <Sidenav>
      <div className="dashboard-content">
        <div className="overview">
          <div className="breadcrumb-container">
            <h1 className="text">Report</h1>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
              <div className="container">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <i className="fas fa-tachometer-alt me-1" />
                      <span onClick={backHome}>Dashboard</span>
                    </li>
                    <li className="breadcrumb-item">
                      <i className="fas fa-duotone fa-house-laptop fa-fw me-1" />
                      <span>Report</span>
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
                      <div className="col-md-3">
                        <label className="ms-2 form-label text-dark">
                          Start Date
                        </label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="form-control"
                          name="date"
                        />
                        {submitted && !startDate && (
                          <span className="text-danger">
                            Start date is required
                          </span>
                        )}
                      </div>
                      <div className="col-md-3">
                        <label className="ms-2 form-label text-dark">
                          End Date
                        </label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="form-control"
                          name="date"
                        />
                        {submitted && !endDate && (
                          <span className="text-danger">
                            End date is required
                          </span>
                        )}
                        {submitted &&
                          endDate !== "" &&
                          new Date(endDate) < new Date(startDate) && (
                            <span className="text-danger">
                              End date cannot be less than start date
                            </span>
                          )}
                      </div>
                      <div className="col-md-3">
                        <label className="ms-2 form-label text-dark">
                          Report Type
                        </label>
                        <select
                          value={reportType}
                          onChange={(e) => setReportType(e.target.value)}
                          className="form-select"
                          id="inputCategory"
                          name="category"
                        >
                          <option value="" disabled>
                            Select
                          </option>
                          <option value="TPS Day">
                            Day Wise Avg Temperature
                          </option>
                          <option value="TPS Week">
                            Week Wise Avg Temperature
                          </option>
                          <option value="MIS">
                            Month Wise Avg Temperature
                          </option>
                          <option value="DSS">Year Wise Avg Temperature</option>
                        </select>
                        {submitted && !reportType && (
                          <span className="text-danger">
                            Report type is required
                          </span>
                        )}
                      </div>
                      <div className="col-md-2 mt-4">
                        <button
                          type="submit"
                          name="tps"
                          className="btn btn-primary my-2"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <hr className="text-dark" />
              <div className="card-body">
                {reportType === "TPS Day" && (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Day</th>
                        <th>Device ID</th>
                        <th>Device Name</th>
                        <th>Log Count</th>
                        <th>Avg Temperature</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.map((item, index) => (
                        <tr key={index}>
                          <td>{item.day}</td>
                          <td>{item.device_id}</td>
                          <td>{item.device_name}</td>
                          <td>{item.log_count}</td>
                          <td>{item.avg_temperature}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {reportType === "TPS Week" && (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Week</th>
                        <th>Device ID</th>
                        <th>Device Name</th>
                        <th>Log Count</th>
                        <th>Avg Temperature</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.map((item, index) => (
                        <tr key={index}>
                          <td>{item.week}</td>
                          <td>{item.device_id}</td>
                          <td>{item.device_name}</td>
                          <td>{item.log_count}</td>
                          <td>{item.avg_temperature}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {reportType === "MIS" && (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Month</th>
                        <th>Device ID</th>
                        <th>Device Name</th>
                        <th>Log Count</th>
                        <th>Avg Temperature</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.map((item, index) => (
                        <tr key={index}>
                          <td>{item.month}</td>
                          <td>{item.device_id}</td>
                          <td>{item.device_name}</td>
                          <td>{item.log_count}</td>
                          <td>{item.avg_temperature}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {reportType === "DSS" && (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Device ID</th>
                        <th>Device Name</th>
                        <th>Log Count</th>
                        <th>Avg Temperature</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.map((item, index) => (
                        <tr key={index}>
                          <td>{item.device_id}</td>
                          <td>{item.device_name}</td>
                          <td>{item.log_count}</td>
                          <td>{item.avg_temperature}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Sidenav>
  );
};

export default CustReport;
