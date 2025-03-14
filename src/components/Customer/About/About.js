import { Link } from "react-router-dom";

const About = () => {
  const backHome = () => {
    window.location.href = "/";
  };
  return (
    <>
      <div className="container-xxl mt-3">
        <div className="bg-body-tertiary">
          <nav
            data-mdb-navbar-init
            className="navbar  navbar-expand-lg bg-body-tertiary"
          >
            <div className="container-fluid">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link onClick={backHome}>Home</Link>
                  </li>
                  <li className="breadcrumb-item active">
                    <Link className="breadcrumb-item active">About</Link>
                  </li>
                </ol>
              </nav>
            </div>
          </nav>
        </div>

        <img
          src="https://images.pexels.com/photos/19331241/pexels-photo-19331241/free-photo-of-smartphone-and-smart-devices.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          className="d-block w-100 image mt-3"
          alt="First slide"
          style={{ maxHeight: "440px" }}
        />
      </div>
      
      <div className="container-xxl mt-3">
        {/* popular product section */}
        <div className="text-center m-4">
          {" "}
          <h2>
            <span class="badge bg-success">Flexi Stream Gateway </span> IoT
            Products
          </h2>
        </div>
        <div className="row m-3">
          
          <div className="col-6">
            <img src="https://www.dusuniot.com/wp-content/uploads/2022/12/dusun-iot-sensors-and-detectors-2.png.webp" className="mt-2" alt="imgiot" />
          </div>
          <div className="col-6 mt-2">
          <h5>Programmable and Multi-protocol IoT Gateways</h5>
            IoT gateways that linkup devices like lights, locks, thermostats,
            outlets, door/window sensors, and other smart devices together. With
            Dusun programmable IoT gateway: IoT solution providers can promote
            their IoT projects in the smart home, smart office, energy-saving,
            and agriculture. Zigbee(1.2/3.0), BLE(5.0/Mesh), Z-Wave, Wi-Fi, and
            3G/4G LTE protocols are supported to make a connection between
            sensors and clouds. Data generated by edge devices can be uplink to
            popular IoT platforms for remote control & management. IoT solution
            providers can integrate devices with digital assistants like Google
            Home and Amazon Echo.
            <br />
            <button className="btn btn-primary">Learn more</button>
          </div>
        </div>

        <div className="row mt-5 ms-3">
        <div className="col-6 mt-3">
          <h5>Programmable and Multi-protocol IoT Gateways</h5>
            IoT gateways that linkup devices like lights, locks, thermostats,
            outlets, door/window sensors, and other smart devices together. With
            Dusun programmable IoT gateway: IoT solution providers can promote
            their IoT projects in the smart home, smart office, energy-saving,
            and agriculture. Zigbee(1.2/3.0), BLE(5.0/Mesh), Z-Wave, Wi-Fi, and
            3G/4G LTE protocols are supported to make a connection between
            sensors and clouds. Data generated by edge devices can be uplink to
            popular IoT platforms for remote control & management. IoT solution
            providers can integrate devices with digital assistants like Google
            Home and Amazon Echo.
            <br />
            <button className="btn btn-primary">Learn more</button>
          </div>
          <div className="col-6">
            <img src="https://www.dusuniot.com/wp-content/uploads/2022/12/dusun-iot-sensors-and-detectors.png.webp" alt="imgiot" />
          </div>
          
        </div>

  
      </div>

    </>
  );
};

export default About;
