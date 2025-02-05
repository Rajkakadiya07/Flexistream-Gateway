import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { Link,useNavigate } from "react-router-dom";

const Forgot = () => {

  const navigate = useNavigate();
  const Loginclick = (e) => {
    e.preventDefault();
    navigate('/auth/Login');
  };
  
  const { resetPassword } = useAuth();
  const [username, setusername] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleResetPassword = async () => {
    try {
      setError('');
      setMessage('');
      await resetPassword(username);
      setMessage('Check your username for further instructions');
    } catch (err) {
      setError('Failed to reset password. Please check your username and try again.');
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center vh-100">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
            <div className="text-center mb-4">
                <img
                  src={`${process.env.PUBLIC_URL}/image/FSG1.png`}
                  alt="FSG Logo"
                  style={{ height: "90px" }}
                />
                <div className="text-center">
                  <span className="fs-2">
                    <b>Flexi Stream Gateway</b>
                  </span>
                </div>
              </div>
              <h5>Password Reset</h5>
              <form>
                <div className="form-group mb-4">
                  <input type="username" id="username" className="form-control" value={username} onChange={(e) => setusername(e.target.value)} placeholder="username"/>
                </div>

                <button type="button" onClick={handleResetPassword} className="btn btn-primary btn-block mb-4"> Reset Password</button>

                {message && <div className="alert alert-success">{message}</div>}
                {error && <div className="alert alert-danger">{error}</div>}

                <div className="text-center">
                  Already created an account?<Link onClick={Loginclick}> Login</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forgot;