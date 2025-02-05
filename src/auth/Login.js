import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const rememberedUsername = localStorage.getItem("username");
    const rememberedPassword = localStorage.getItem("password");
    if (rememberedUsername && rememberedPassword) {
      setUsername(rememberedUsername);
      setPassword(rememberedPassword);
      setRemember(true);
    }
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    try {
      const newErrors = {};

      if (!username.trim()) {
        newErrors.username = "Username is required";
      } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        newErrors.username =
          "Username can only contain letters, numbers, and underscores";
      }

      if (!password.trim()) {
        newErrors.password = "Password is required";
      } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d_]{8,}$/.test(password)) {
        newErrors.password =
          "Password must be at least 8 characters long and contain at least one letter and one number";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        alert(Object.values(newErrors).join("\n"));
        return;
      }

      // Reset errors if no validation errors
      setErrors({});

      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, remember }),
      });

      if (!response.ok) {
        console.error(`Login failed: ${response.statusText}`);
        alert("invalid credentials");
        throw new Error("Login failed");
      }

      const data = await response.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        onLogin();
        const role = data.user.role_name;
        console.log(
          `Session started for user: ${data.user.username}, Role: ${role}`
        );
        if (role === "admin") {
          navigate("/Dashboard");
        } else if (role === "customer") {
          navigate("/Customer_dashboard");
        } else {
          console.error("Unknown user role:", role);
        }
      } else {
        console.error("Login failed:", data.error);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const forgotClick = (e) => {
    e.preventDefault();
    navigate("/auth/Forgot");
  };

  const registerClick = (e) => {
    e.preventDefault();
    navigate("/auth/Register");
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
              <h5>Sign into your account</h5>
              <form>
                <div className="mb-4">
                  <input
                    type="text"
                    id="username"
                    className={`form-control ${
                      errors.username ? "is-invalid" : ""
                    }`}
                    placeholder="Username"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setErrors({ ...errors, username: "" });
                    }}
                  />
                  {errors.username && (
                    <div className="invalid-feedback">{errors.username}</div>
                  )}
                </div>

                <div className="mb-4">
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      className={`form-control ${
                        errors.password ? "is-invalid" : ""
                      }`}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setErrors({ ...errors, password: "" });
                      }}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={togglePasswordVisibility}
                    >
                      <i
                        className={`fas ${
                          showPassword ? "fa-eye-slash" : "fa-eye"
                        }`}
                      ></i>
                    </button>
                  </div>
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>

                <div className="row mb-4">
                  <div className="col d-flex justify-content-center">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="Remember"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="Remember">
                        {" "}
                        Remember me{" "}
                      </label>
                    </div>
                  </div>

                  <div className="col text-end">
                    <Link
                      onClick={forgotClick}
                      className="text-decoration-none fs-6 "
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-primary btn-block mb-4"
                  onClick={handleLogin}
                >
                  Sign in
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
