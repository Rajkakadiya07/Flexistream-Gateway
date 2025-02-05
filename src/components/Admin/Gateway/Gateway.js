import React, { useState, useEffect } from "react";
import Layout from "../Layout/Layout";
import { Link } from "react-router-dom";
import axios from "axios";

const Gateway = () => {
  const [gateways, setGateways] = useState([]);

  useEffect(() => {
    fetchGateways();
  }, []);

  const fetchGateways = async () => {
    try {
      const response = await axios.get("http://localhost:3001/admin/gateways");
      const gatewaysWithData = await Promise.all(
        response.data.map(async (gateway) => {
          const customerResponse = await axios.get(
            `http://localhost:3001/customers/${gateway.customer_id}`
          );
          const customerName = customerResponse.data.customer_name;
          return { ...gateway, customer_name: customerName };
        })
      );
      setGateways(gatewaysWithData);
    } catch (error) {
      console.error("Error fetching gateways:", error);
    }
  };

  const deleteGateway = async (gatewayId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this gateway?"
    );
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:3001/admin/gateways/${gatewayId}`);
      // After successful deletion, fetch updated gateways
      alert("Gateway deleted successfully");
      fetchGateways();
    } catch (error) {
      console.error("Error deleting gateway:", error);
    }
  };
  return (
    <Layout>
      <div className="dash-content">
        <div className="activity">
          <div className="breadcrumb-container">
            <h1 className="text">Gateway</h1>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
              <div className="container">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <i className="fas fa-tachometer-alt me-1" />
                      <Link to="/Dashboard">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <i className="fas fa-globe fa-fw me-1" />
                      <span className="active">Gateway</span>
                    </li>
                  </ol>
                </nav>
              </div>
            </nav>
          </div>
          <div className="mt-4">
            <div className="card">
              <div className="card-header">
                <h5>Gateways</h5>
              </div>
              <div className="card-body">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Gateway ID</th>
                      <th>Gateway Name</th>
                      <th>Customer ID</th>
                      <th>Customer Name</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gateways.map((gateway) => (
                      <tr key={gateway.gateway_id}>
                        <td>{gateway.gateway_id}</td>
                        <td>{gateway.gateway_name}</td>
                        <td>{gateway.customer_id}</td>
                        <td>{gateway.customer_name}</td>
                        <td className="d-flex">
                          <Link>
                            <button
                              
                              className="btn btn-danger btn-sm"
                              onClick={() => deleteGateway(gateway.gateway_id)}
                            >
                              <i className="fas fa-trash" />
                            </button>
                          </Link>
                          <Link
                            
                            to={`/Gateway/UpdateGateway/${gateway.gateway_id}`}
                            className="btn btn-success btn-sm ms-1"
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
    </Layout>
  );
};

export default Gateway;
