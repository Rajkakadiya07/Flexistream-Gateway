// client/components/Report.js

import React, { useState } from "react";
import Layout from "../Layout/Layout";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Report = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportCategory, setReportCategory] = useState("");
  const [reportData, setReportData] = useState([]);
  const [error, setError] = useState(null);

  const dashboardClick = (event) => {
    event.preventDefault();
    navigate("/Dashboard");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!startDate || !endDate || !reportCategory) {
      setError("Please fill in all fields.");
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      setError("End date cannot be earlier than start date.");
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:3001/generate-${reportCategory
          .toLowerCase()
          .replace(/\s+/g, "-")}-report`,
        {
          startDate,
          endDate,
        }
      );

      setReportData(response.data.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error fetching report data. Please try again later.");
    }
  };

  const renderReportTable = () => {
    switch (reportCategory) {
      case "TPS Day":
      case "TPS Week":
        return (
          <table className="table">
            <thead>
              <tr>
                <th>Time Interval</th>
                <th>Device ID</th>
                <th>Device Name</th>
                <th>Log Count</th>
                <th>Average Temperature</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.time_interval}</td>
                  <td>{entry.device_id}</td>
                  <td>{entry.device_name}</td>
                  <td>{entry.count}</td>
                  <td>{entry.avg_temperature}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case "MIS":
        return (
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
              {reportData.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.month}</td>
                  <td>{entry.device_id}</td>
                  <td>{entry.device_name}</td>
                  <td>{entry.log_count}</td>
                  <td>{entry.avg_temperature}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case "DSS":
        return (
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
              {reportData.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.device_id}</td>
                  <td>{entry.device_name}</td>
                  <td>{entry.log_count}</td>
                  <td>{entry.avg_temperature}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="dash-content">
        <div className="activity">
          <div className="breadcrumb-container">
            <h1 className="text">Reports</h1>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
              <div className="container">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <i className="fas fa-tachometer-alt me-1" />
                      <Link onClick={dashboardClick}>Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <i className="fas fa-globe me-1" />
                      <Link className="active">Reports</Link>
                    </li>
                  </ol>
                </nav>
              </div>
            </nav>
          </div>
        </div>
        <div className="mt-4">
          <div className="card" style={{ borderRadius: 10, maxWidth: "100%" }}>
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
                        id="start-date"
                        className="form-control"
                        name="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="ms-2 form-label text-dark">
                        End Date
                      </label>
                      <input
                        type="date"
                        id="inputDate"
                        className="form-control"
                        name="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="ms-2 form-label text-dark">
                        Report Type
                      </label>
                      <select
                        id="inputCategory"
                        name="category"
                        className="form-select"
                        value={reportCategory}
                        onChange={(e) => setReportCategory(e.target.value)}
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
                        <option value="MIS">Month Wise Avg Temperature</option>
                        <option value="DSS">Year Wise Avg Temperature</option>
                      </select>
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
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              {renderReportTable()}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default Report;