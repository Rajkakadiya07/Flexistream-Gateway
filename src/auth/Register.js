import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    contact: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({
    fullname: "",
    contact: "",
    password: "",
  });
  const [fieldClicked, setFieldClicked] = useState({
    fullname: false,
    contact: false,
    password: false,
  });
  const navigate = useNavigate();

  const Loginclick = (e) => {
    e.preventDefault();
    navigate("/auth/Login");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    let isValid = true;
    const errors = { fullname: "", contact: "", password: "" };

    // Validate Full Name
    if (!formData.fullname.trim()) {
      isValid = false;
      errors.fullname = "Full name is required";
    }

    // Validate Contact
    const contactRegex = /^\d{10}$/;
    if (!formData.contact.trim() || !contactRegex.test(formData.contact)) {
      isValid = false;
      errors.contact = "Valid contact is required";
    }

    // Validate Password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
    if (!formData.password.trim()!==0 || !passwordRegex.test(formData.password)) {
      isValid = false;
      errors.password =
        alert("Password must be at least 6 characters with one uppercase letter, one lowercase letter, and one digit");
    } 

    setFormErrors(errors);

    return isValid;
  };

  const validateOnFocus = (field) => {
    const errors = { ...formErrors };

    switch (field) {
      case "fullname":
        errors.fullname =
          formData.fullname.trim() && !fieldClicked.fullname
            ? ""
            : "Full name is required";
        break;
      case "contact":
        const contactRegex = /^\d{10}$/;
        errors.contact =
          formData.contact.trim() && contactRegex.test(formData.contact)
            ? ""
            : "Valid contact is required";
        break;
      case "password":
        errors.password =
          formData.password.trim() && !fieldClicked.password
            ? ""
            : "Password is required";
        break;
      default:
        break;
    }

    setFormErrors(errors);
    setFieldClicked((prev) => ({ ...prev, [field]: true }));
  };

  const validateOnBlur = (field) => {
    const errors = { ...formErrors };

    switch (field) {
      case "fullname":
        errors.fullname = formData.fullname.trim() ? "" : "Full name is required";
        break;
        case "contact":
          const contactRegex = /^\d{10}$/;
          errors.contact =
            formData.contact.trim() && contactRegex.test(formData.contact)
              ? ""
              : "Valid contact is required (10 digits only)";
          break;
        
          
          
      default:
        break;
    }

    setFormErrors(errors);
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await fetch("http://localhost:3001/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const responseData = await response.json();
          alert(`Registration successful: ${JSON.stringify(responseData)}`);
          navigate("/auth/Login");
        } else {
          const errorData = await response.json();
          alert(`Registration failed: ${errorData.message}`);
        }
      } catch (error) {
        console.error("Error registering user:", error);
        alert("An error occurred during registration");
      }
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
              <h5>Create an account</h5>
              <form onSubmit={handleRegister}>
                <div className="row mb-4">
                  <div className="col">
                    <input
                      type="text"
                      id="fullname"
                      className={`form-control ${
                        formErrors.fullname && "is-invalid"
                      }`}
                      placeholder="Full Name"
                      value={formData.fullname}
                      onChange={(e) =>
                        handleInputChange("fullname", e.target.value)
                      }
                      onFocus={() => validateOnFocus("fullname")}
                      onBlur={() => validateOnBlur("fullname")}
                    />
                    <div className="invalid-feedback">{formErrors.fullname}</div>
                  </div>
                </div>

                <div className="mb-4">
                  <input
                    type="tel"
                    id="contact"
                    className={`form-control ${
                      formErrors.contact && "is-invalid"
                    }`}
                    placeholder="Contact"
                    value={formData.contact}
                    onChange={(e) =>
                      handleInputChange("contact", e.target.value)
                    }
                    onFocus={() => validateOnFocus("contact")}
                    onBlur={() => validateOnBlur("contact")}
                  />
                  <div className="invalid-feedback">{formErrors.contact}</div>
                </div>

                <div className="mb-4">
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      className={`form-control ${
                        formErrors.password && "is-invalid"
                      }`}
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      onFocus={() => validateOnFocus("password")}
                      onBlur={() => validateOnBlur("password")}
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
                    <div className="invalid-feedback">
                      {formErrors.password}
                    </div>
                  </div>
                </div>

                <div className="form-check d-flex justify-content-center mb-4">
                  <input
                    className="form-check-input me-2"
                    type="checkbox"
                    value=""
                    id="Terms"
                    defaultChecked
                  />
                  <label className="form-check-label" htmlFor="Terms">
                    I agree to all statements in{" "}
                    <Link to="./Terms" className="text-body">
                      <u>Terms of service</u>
                    </Link>
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-block mb-4"
                >
                  Sign up
                </button>

                <div className="text-center">
                  <p className="mb-1">
                    Not a member? <Link onClick={Loginclick}> Login</Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
