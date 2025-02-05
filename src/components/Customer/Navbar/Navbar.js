import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../auth/AuthContext';

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const handleNavigation = (path) => (event) => {
    event.preventDefault();
    navigate(path);
  };

  const handleLoginClick = handleNavigation('./auth/Login');
  const handleRegisterClick = handleNavigation('./auth/Register');

  const handleLogout = (event) => {
    event.preventDefault();
    logout();
    navigate('./auth/Login');
  };

  // Check if the current path is excluded
  if (location.pathname === '/auth/Login' || location.pathname === '/auth/Register' || location.pathname === '/auth/Forgot') {
    return null;
  }

  return (
    <nav className="navbar navbar-expand-md navbar-light bg-body-tertiary">
      <div className="container">
        <Link className="navbar-brand" onClick={handleNavigation('/')}>
          <img src={`${process.env.PUBLIC_URL}/image/FSG.png`} alt="FSG Logo" style={{ height: '40px', marginRight: '10px' }} /> Flexi Stream Gateway
        </Link>
        <button className="navbar-toggler" type="button" onClick={toggleNav} aria-controls="navbarNav" aria-expanded={isNavOpen} aria-label="Toggle navigation">
          <i className="fas fa-bars"></i>
        </button>
        <div className={`collapse navbar-collapse justify-content-center${isNavOpen ? ' show' : ''}`} id="navbarNav">
          <ul className="navbar-nav mb-2 mb-lg-0">
            {!isLoggedIn && (
              <>
                <NavItem onClick={handleNavigation('/')}>Home</NavItem>
                <NavItem onClick={handleNavigation('/About')}>About</NavItem>
                <NavItem onClick={handleNavigation('/Devices')}>Devices</NavItem>
                <NavItem onClick={handleNavigation('/Contact')}>Contact Us</NavItem>
                <NavItem onClick={handleNavigation('/Profile')}>Profile</NavItem>
              </>
            )}
          </ul>
        </div>
        <div className="d-flex align-items-center">
          {!isLoggedIn && (
            <>
              {/* Icon */}
              <Link onClick={handleNavigation('/Cart')} className="link-secondary me-3" to="#">
                <i className="fas fa-shopping-cart"></i>
              </Link>
              {/* Notifications */}
              <DropdownMenu>
                <Link className="dropdown-item" to="#">
                  Some news
                </Link>
                <Link className="dropdown-item" to="#">
                  Another news
                </Link>
                <Link className="dropdown-item" to="#">
                  Something else here
                </Link>
              </DropdownMenu>
              <button onClick={handleLoginClick} className="btn btn-link px-3 me-2">
                Login
              </button>
              <button onClick={handleRegisterClick} className="btn btn-primary me-3">
                Sign up
              </button>
            </>
          )}
        </div>
        {isLoggedIn && (
          <div className="d-flex align-items-center">
            {/* Avatar */}
            <DropdownMenu>
              <Link className="dropdown-item" to="/profile">
                My profile
              </Link>
              <Link className="dropdown-item" to="/settings">
                Settings
              </Link>
              <button className="btn btn-link dropdown-item" onClick={handleLogout}>
                Logout
              </button>
            </DropdownMenu>
          </div>
        )}
      </div>
    </nav>
  );
};

const NavItem = ({ onClick, children }) => (
  <li className="nav-item ms-2 ms-md-4">
    <Link className="nav-link" onClick={onClick}>
      {children}
    </Link>
  </li>
);

const DropdownMenu = ({ children }) => (
  <div className="dropdown">
    <Link
      className="dropdown-toggle d-flex align-items-center hidden-arrow"
      to="/profile"
      role="button"
      data-mdb-toggle="dropdown"
      aria-expanded="false"
    >
      <img
        src="https://mdbcdn.b-cdn.net/img/new/avatars/2.webp"
        className="rounded-circle"
        height={25}
        alt="Avatar"
        loading="lazy"
      />
    </Link>
    <ul className="dropdown-menu dropdown-menu-end">{children}</ul>
  </div>
);

export default Navbar;