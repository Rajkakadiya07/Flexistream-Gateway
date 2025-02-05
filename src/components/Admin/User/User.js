import React, { useEffect, useState } from "react";
import Layout from "../Layout/Layout";
import "./User.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const User = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [customers, setCustomers] = useState([]);

  const dashboardClick = (event) => {
    event.preventDefault();
    navigate("/Dashboard");
  };

  const addUserClick = (event) => {
    event.preventDefault();
    navigate("/User/AddUser");

    if (location.pathname === "/User/AddDetail") {
      return null;
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get("http://localhost:3001/customers");
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDeleteCustomer = async (customerId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this customer?");
    if (!confirmDelete) {
      return; // If user cancels, do nothing
    }
  
    try {
      await axios.delete(`http://localhost:3001/customers/${customerId}`);
   alert("Customer Deleted Successfully");
      fetchCustomers();
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };
  
  return (
    <Layout>
      <div className="dash-content">
        <div className="activity">
          <div className="breadcrumb-container">
            <h1 className="text">User</h1>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
              <div className="container">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <i className="fas fa-tachometer-alt me-1" />
                      <Link onClick={dashboardClick}>Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <i className="fas fa-users me-1" />
                      <Link className="active">User</Link>
                    </li>
                  </ol>
                </nav>
              </div>
            </nav>
          </div>

          <div className="mt-4">
            <div className="card" style={{ borderRadius: 10 }}>
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
                  Users Details
                </h5>
                <Link
                  className="btn btn-primary mt-2"
                  onClick={addUserClick}
                  style={{
                    borderRadius: 20,
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  <i className="uil uil-plus" />
                  Add User
                </Link>
              </div>
              <hr className="text-dark"/>
              <div className="card-body">
              <div className="table-responsive">
                <table
                  id="example"
                  className="table table-striped"
                  style={{ width: "100%" }}
                >
                  <thead>
                    <tr>
                      <th>Customer Name</th>
                      <th>Contact No. 1</th>
                      <th>Contact No. 2</th>
                      <th>Address</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer) => (
                      <tr key={customer.customer_id}>
                        <td>{customer.customer_name}</td>
                        <td>{customer.customer_contact_1}</td>
                        <td>{customer.customer_contact_2}</td>
                        <td>{customer.customer_address}</td>
                        <td>
                        <Link>
                            <button
                             
                             className="btn btn-danger btn-sm"
                              onClick={() => handleDeleteCustomer(customer.customer_id)}  
                            >
                              <i className="fas fa-trash" />
                            </button>
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

export default User;
