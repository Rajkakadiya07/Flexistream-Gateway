import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const Home = () => {

  const backHome = () => {
    window.location.href = "/";
  };

  useEffect(() => {
    const myCarousel = document.getElementById("carouselExampleCaptions");
    const carouselCaptions = myCarousel.querySelectorAll(".carousel-caption");

    myCarousel.addEventListener("slid.bs.carousel", () => {
      carouselCaptions.forEach((caption) => {
        caption.classList.add("animated-text");
      });
    });

    myCarousel.addEventListener("slide.bs.carousel", () => {
      carouselCaptions.forEach((caption) => {
        caption.classList.remove("animated-text");
      });
    });
  }, []);

  return (
    <>
      <div className="container-fluid mt-4">
        
        <div className="bg-body-tertiary">
          <nav
            data-mdb-navbar-init
            className="navbar navbar-expand-lg bg-body-tertiary"
          >
            <div className="container-fluid ">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item ms-2">
                    <Link onClick={backHome}>Home</Link>
                  </li>
                </ol>
              </nav>
            </div>
          </nav>
        </div>

        {/* slider section */}

        <div
          id="carouselExampleCaptions"
          className="carousel slide mt-3"
          data-bs-ride="carousel"
          style={{ maxWidth: "2000px", margin: "0 auto" }}
        >
          <div className="carousel-indicators">
            <button
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide-to="0"
              className="active"
              aria-current="true"
              aria-label="Slide 1"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide-to="1"
              aria-label="Slide 2"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide-to="2"
              aria-label="Slide 3"
            ></button>
          </div>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img
                src="https://images.pexels.com/photos/3912367/pexels-photo-3912367.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
                className="d-block w-100 image card-zoom"
                alt="First slide"
                style={{ maxHeight: "440px" }}
              />
              <div className="carousel-caption d-none d-md-block animated-text">
                <h5>First slide label</h5>
                <p>
                  Some representative placeholder content for the first slide.
                </p>
              </div>
            </div>
            <div className="carousel-item">
              <img
                src="https://images.pexels.com/photos/13089942/pexels-photo-13089942.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
                className="d-block w-100 image card-zoom"
                alt="Second slide"
                style={{ maxHeight: "440px" }}
              />
              <div className="carousel-caption d-none d-md-block animated-text">
                <h5>Second slide label</h5>
                <p>
                  Some representative placeholder content for the second slide.
                </p>
              </div>
            </div>
            <div className="carousel-item">
              <img
                src="https://images.pexels.com/photos/163125/board-printed-circuit-board-computer-electronics-163125.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
                className="d-block w-100 image card-zoom"
                alt="Third slide"
                style={{ maxHeight: "440px" }}
              />
              <div className="carousel-caption d-none d-md-block animated-text">
                <h5>Third slide label</h5>
                <p>
                  Some representative placeholder content for the third slide.
                </p>
              </div>
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>

        {/* device card section */}

        <div className="row row-cols-1 row-cols-md-4 g-4 mt-3">
          <div className="col">
            <div className="card card-zoom">
              <div className="card-header">
                <h5 className="card-title">IOT Device</h5>
              </div>
              <div className="position-relative">
                <img
                  src="https://www.dusuniot.com/wp-content/uploads/2023/09/gateway-hardware.png"
                  className="card-img-top img-fluid"
                  alt="Card Image"
                />
                <div className="card-body d-flex justify-content-center align-items-center">
                  <button type="button" className="btn btn-secondary">
                    See More
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="col">
            <div className="card card-zoom">
              <div className="card-header">
                <h5 className="card-title">IOT Device</h5>
              </div>
              <div className="position-relative">
                <img
                  src="https://www.dusuniot.com/wp-content/uploads/2023/09/gateway-hardware.png"
                  className="card-img-top img-fluid"
                  alt="Card Image"
                />
                <div className="card-body d-flex justify-content-center align-items-center">
                  <button type="button" className="btn btn-secondary">
                    See More
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="col">
            <div className="card card-zoom">
              <div className="card-header">
                <h5 className="card-title">IOT Device</h5>
              </div>
              <div className="position-relative">
                <img
                  src="https://www.dusuniot.com/wp-content/uploads/2023/09/gateway-hardware.png"
                  className="card-img-top img-fluid"
                  alt="Card Image"
                />
                <div className="card-body d-flex justify-content-center align-items-center">
                  <button type="button" className="btn btn-secondary">
                    See More
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="col">
            <div className="card card-zoom">
              <div className="card-header">
                <h5 className="card-title">IOT Device</h5>
              </div>
              <div className="position-relative">
                <img
                  src="https://www.dusuniot.com/wp-content/uploads/2023/09/gateway-hardware.png"
                  className="card-img-top img-fluid"
                  alt="Card Image"
                />
                <div className="card-body d-flex justify-content-center align-items-center">
                  <button type="button" className="btn btn-secondary">
                    See More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* popular product section */}
        <div className="text-center m-4">
          {" "}
          <h2>
            Popular IoT Products at{" "}
            <span className="badge bg-success">Flexi Stream Gateway</span>
          </h2>
        </div>

        <div className="container">
          <div className="row row-cols-1 row-cols-md-5 g-2 mt-4">
            <div className="col">
              <div className="card">
                <div className="d-flex justify-content-between p-3">
                  <button
                    type="button"
                    className="btn btn-outline-dark"
                    data-mdb-ripple-init=""
                    data-mdb-ripple-color="light"
                  >
                    DSGW-210
                  </button>
                </div>
                <img
                  src="https://www.dusuniot.com/wp-content/uploads/2023/09/dsgw-090.jpg"
                  className="card-img-top"
                  alt="Laptop"
                />
                <div className="card-body">
                  <div className="d-flex justify-content-between mb-3">
                    <h5 className="mb-0">IoT Gateway Edge Computing Gateway</h5>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p className="small">
                      <a href="#!" className="text-muted">
                        CPU:
                      </a>
                      <a href="#!" className="text-muted ms-3">
                        RK3328 Quad-core Cortex A53
                      </a>
                    </p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p className="small">
                      <a href="#!" className="text-muted">
                        RAM :
                      </a>
                      <a href="#!" className="text-muted ms-3">
                        1GB / 2 GB for option
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card">
                <div className="d-flex justify-content-between p-3">
                  <button
                    type="button"
                    className="btn btn-outline-dark"
                    data-mdb-ripple-init=""
                    data-mdb-ripple-color="light"
                  >
                    DSGW-210
                  </button>
                </div>
                <img
                  src="https://www.dusuniot.com/wp-content/uploads/2023/09/dsgw-090.jpg"
                  className="card-img-top"
                  alt="Laptop"
                />
                <div className="card-body">
                  <div className="d-flex justify-content-between mb-3">
                    <h5 className="mb-0">IoT Gateway Edge Computing Gateway</h5>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p className="small">
                      <a href="#!" className="text-muted">
                        CPU:
                      </a>
                      <a href="#!" className="text-muted ms-3">
                        RK3328 Quad-core Cortex A53
                      </a>
                    </p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p className="small">
                      <a href="#!" className="text-muted">
                        RAM :
                      </a>
                      <a href="#!" className="text-muted ms-3">
                        1GB / 2 GB for option
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card">
                <div className="d-flex justify-content-between p-3">
                  <button
                    type="button"
                    className="btn btn-outline-dark"
                    data-mdb-ripple-init=""
                    data-mdb-ripple-color="light"
                  >
                    DSGW-210
                  </button>
                </div>
                <img
                  src="https://www.dusuniot.com/wp-content/uploads/2023/09/dsgw-090.jpg"
                  className="card-img-top"
                  alt="Laptop"
                />
                <div className="card-body">
                  <div className="d-flex justify-content-between mb-3">
                    <h5 className="mb-0">IoT Gateway Edge Computing Gateway</h5>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p className="small">
                      <a href="#!" className="text-muted">
                        CPU:
                      </a>
                      <a href="#!" className="text-muted ms-3">
                        RK3328 Quad-core Cortex A53
                      </a>
                    </p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p className="small">
                      <a href="#!" className="text-muted">
                        RAM :
                      </a>
                      <a href="#!" className="text-muted ms-3">
                        1GB / 2 GB for option
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
      <style>
        {`
          .animated-text {
            opacity: 0;
            transform: translateY(100%);
            transition: opacity 0.5s, transform 0.5s;
          }

          .carousel-caption.animated-text {
            opacity: 2;
            transform: translateY(10);
            animation: slideIn 0.5s 0.5s forwards;
          }

          @keyframes slideIn {
            from {
              transform: translateY(100%);
            }
            to {
              transform: translateY(0);
            }
          }

          .card {
            overflow: hidden;
          }
        
          .card img {
            transition: transform 0.3s ease-in-out;
          }
        
          .card:hover img {
            transform: scale(0.7);
          }
        `}
      </style>
    </>
  );
};

export default Home;
