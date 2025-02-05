import { Link } from "react-router-dom";

const UserProfile = () => {
  const backHome = () => {
    window.location.href = "/";
  };
  return (
    <section>
      <div className="container-xxl mt-4">
        <div className="bg-body-tertiary">
          <nav data-mdb-navbar-init className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link onClick={backHome}>Home</Link>
                  </li>
                  <li className="breadcrumb-item active">
                    <Link className="breadcrumb-item active">Profile</Link>
                  </li>
                </ol>
              </nav>
            </div>
          </nav>
        </div>
      </div>
      <div className="container mt-4">
        <div className="row">
          <div className="col-lg-4">
            <div className="card mb-4">
              <div className="card-body text-center">
                <img
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                  alt="avatar"
                  className="rounded-circle img-fluid"
                  style={{ width: 150 }}
                />
                <h5 className="my-3">John Smith</h5>
                <p className="text-muted mb-1">Full Stack Developer</p>
                <p className="text-muted mb-4">Bay Area, San Francisco, CA</p>
                <div className="d-flex justify-content-center mb-2">
                  <button type="button" className="btn btn-primary">
                    Upload
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-8 ">
            <div className="card mb-4">
              <div className="card-body">
                <ul className="nav nav-tabs" id="myTabs" role="tablist">
                  <li className="nav-item" role="presentation">
                    <a
                      className="nav-link active"
                      id="profile-tab"
                      data-bs-toggle="tab"
                      href="#profile"
                      role="tab"
                      aria-controls="profile"
                      aria-selected="true"
                    >
                      Profile
                    </a>
                  </li>
                  <li className="nav-item" role="presentation">
                    <a
                      className="nav-link"
                      id="password-tab"
                      data-bs-toggle="tab"
                      href="#password"
                      role="tab"
                      aria-controls="password"
                      aria-selected="false"
                    >
                      Password
                    </a>
                  </li>
                </ul>
                <div className="tab-content">
                  <div
                    className="tab-pane fade show active"
                    id="profile"
                    role="tabpanel"
                  >
                    {/* Profile Tab Content */}
                    <div className="row ">
                      <div className="col-lg-12 mt-4">
                        <div className="row ">
                          <div className="col-sm-3">
                            <p className="mb-0 ">First Name</p>
                          </div>
                          <div className="col-sm-9">
                            <input
                              type="text"
                              id="firstName"
                              placeholder="Jeel"
                              className="form-control"
                            />
                          </div>
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-sm-3">
                            <p className="mb-0">Last Name</p>
                          </div>
                          <div className="col-sm-9">
                            <input
                              type="text"
                              id="lastName"
                              placeholder="Moradiya"
                              className="form-control"
                            />
                          </div>
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-sm-3">
                            <p className="mb-0">Email</p>
                          </div>
                          <div className="col-sm-9">
                            <input
                              type="text"
                              id="Email"
                              placeholder="Jeel@gmail.com"
                              className="form-control"
                            />
                          </div>
                        </div>

                        <hr />
                        <div className="row">
                          <div className="col-sm-3">
                            <p className="mb-0">Mobile</p>
                          </div>
                          <div className="col-sm-9">
                            <input
                              type="text"
                              id="Phone"
                              placeholder="9898120304"
                              className="form-control"
                            />
                          </div>
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-sm-3">
                            <p className="mb-0">Address</p>
                          </div>
                          <div className="col-sm-9">
                            <input
                              type="text"
                              id="address"
                              placeholder="India"
                              className="form-control"
                            />
                          </div>
                        </div>

                        <div className="row mt-4">
                          <div className="d-flex justify-content-left  mb-2">
                            <button
                              type="button"
                              className="btn btn-outline-success ms-1"
                            >
                              Update
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane fade" id="password" role="tabpanel">
                    {/* Password Tab Content */}
                    <div className="row mt-4">
                      <div className="col-sm-3">
                        <p className="mb-0">New Password</p>
                      </div>
                      <div className="col-sm-9">
                        <input
                          type="password"
                          id="newPassword"
                          className="form-control"
                        />
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        <p className="mb-0">Confirm Password</p>
                      </div>
                      <div className="col-sm-9">
                        <input
                          type="password"
                          id="confirmPassword"
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="row mt-4">
                      <div className="d-flex justify-content-left mb-2">
                        <button
                          type="button"
                          className="btn btn-outline-success ms-1"
                        >
                          Change Password
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
