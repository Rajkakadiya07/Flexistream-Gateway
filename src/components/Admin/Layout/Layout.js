// Layout.js
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../auth/AuthContext";
import "./Layout.css";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const DashboardClick = (event) => {
    event.preventDefault();
    navigate("/Dashboard");
  };

  const DeviceClick = (event) => {
    event.preventDefault();
    navigate("/Device/device");
  };

  const GatewayClick = (event) => {
    event.preventDefault();
    navigate("/Gateway/Gateway");
  };

  const SensorsClick = (event) => {
    event.preventDefault();
    navigate("/Sensor/Sensor");
  };

  const ReportClick = (event) => {
    event.preventDefault();
    navigate("/Reports/Report");
  };

  const UserClick = (event) => {
    event.preventDefault();
    navigate("/User/user");
  };

  const Profileclick = (event) => {
    event.preventDefault();
    navigate("/Profile/Profile");
  };

  const handleLogout = (event) => {
    event.preventDefault();
    logout();
    navigate("/");
  };

  if (
    location.pathname === "/Auth/Login" ||
    location.pathname === "/Auth/Register" ||
    location.pathname === "/Auth/Forgot"
  ) {
    return null;
  }
  // State to track whether the sidebar is open or closed

  return (
    <>
      {/*Main Navigation*/}
      <header>
        {/* Sidebar */}
        <nav
          id="sidebarMenu"
          className={`collapse d-lg-block sidebar collapse bg-white ${
            isSidebarOpen ? "" : "hide-sidebar"
          }`}
        >
          <div className="position-sticky">
            <div className="list-group list-group-flush mx-3 mt-4">
              <Link
                onClick={DashboardClick}
                className="list-group-item list-group-item-action py-2 ripple"
                aria-current="true"
              >
                <i className="fas fa-tachometer-alt fa-fw me-3" />
                <span>Dashboard</span>
              </Link>
              <Link
                onClick={DeviceClick}
                className="list-group-item list-group-item-action py-2 ripple"
              >
                <i class="fas fa-duotone fa-house-laptop fa-fw me-3"></i>
                <span>Device Manage</span>
              </Link>
              <Link
                onClick={GatewayClick}
                className="list-group-item list-group-item-action py-2 ripple"
              >
                <i className="fas fa-globe fa-fw me-3" />
                <span>Gateways</span>
              </Link>
              <Link
                onClick={SensorsClick}
                className="list-group-item list-group-item-action py-2 ripple"
              >
                <i class="fas fa-house-laptop fa-fw me-3"></i>
                <span>Sensors</span>
              </Link>
              <Link
                onClick={ReportClick}
                className="list-group-item list-group-item-action py-2 ripple"
              >
                <i className="fas fa-chart-line fa-fw me-3" />
                <span>Reports</span>
              </Link>
              <Link
                onClick={UserClick}
                className="list-group-item list-group-item-action py-2 ripple"
              >
                <i className="fas fa-users fa-fw me-3" />
                <span>User Manage</span>
              </Link>
              <Link
                onClick={Profileclick}
                className="list-group-item list-group-item-action py-2 ripple"
              >
                <i className="fas fa-gear fa-fw me-3" />
                <span>Settings</span>
              </Link>
              <Link
                onClick={handleLogout}
                className="list-group-item list-group-item-action py-2 ripple"
              >
                <i className="fas fa-right-from-bracket fa-fw me-3" />
                <span>Logout</span>
              </Link>
            </div>
          </div>
        </nav>
        {/* Sidebar */}
        {/* Navbar */}
        <nav
          id="main-navbar"
          className="navbar navbar-expand-lg navbar-light bg-white fixed-top"
        >
          {/* Container wrapper */}
          <div className="container-fluid">
            {/* Toggle button */}
            <button
              onClick={toggleSidebar}
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#sidebarMenu"
              aria-controls="sidebarMenu"
              aria-expanded={isSidebarOpen ? "true" : "false"}
              aria-label="Toggle navigation"
            >
              <i className="fas fa-bars" />
            </button>
            {/* Brand */}
            <Link className="navbar-brand" href="#">
              <img
                src={`${process.env.PUBLIC_URL}/image/FSG.png`}
                alt="FSG Logo"
                style={{ height: "40px", marginRight: "10px" }}
              />{" "}
              Flexi Stream Gateway
            </Link>
            {/* Search form */}
            <form className="d-none d-md-flex input-group w-auto my-auto">
              <input
                autoComplete="off"
                type="search"
                className="form-control rounded"
                placeholder="Search"
                style={{ minWidth: 225 }}
              />
              <span className="input-group-text border-0">
                <i className="fas fa-search" />
              </span>
            </form>
            {/* Right links */}
            <ul className="navbar-nav ms-auto d-flex flex-row">
              {/* Avatar */}
              <li className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle hidden-arrow d-flex align-items-center"
                  href="#"
                  id="navbarDropdownMenuLink"
                  role="button"
                  data-mdb-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src="https://mdbootstrap.com/img/Photos/Avatars/img (31).jpg"
                    className="rounded-circle"
                    height={30}
                    alt="Avatar"
                    loading="lazy"
                  />
                </Link>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="navbarDropdownMenuLink"
                >
                  <li>
                    <Link className="dropdown-item" href="#">
                      My profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="#">
                      Settings
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" onClick={handleLogout}>
                      Logout
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          {/* Container wrapper */}
        </nav>
        {/* Navbar */}
      </header>
      {/*Main Navigation*/}
      {/*Main layout*/}
      <main style={{ margin: 40 }}>
        <div
          className={`container pt-5 ${
            isSidebarOpen ? "" : "expand-container"
          }`}
        >
          {children}
        </div>
      </main>
      {/*Main layout*/}
    </>
  );
};

export default Layout;
