import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import Login from "./auth/Login";
import Register from "./auth/Register";
import Forgot from "./auth/Forgot";

import Customer_dashboard from "./components/Customer_dashboard/Customer_dashboard";
import CustProfile from "./components/Customer_dashboard/CustProfile/CustProfile";
import DeviceMoniter from "./components/Customer_dashboard/DeviceMoniter/DeviceMoniter";
import Log from "./components/Customer_dashboard/DeviceMoniter/Log";
import DeviceDetails from "./components/Customer_dashboard/DeviceMoniter/DeviceDetails";
import CustReport from "./components/Customer_dashboard/CustReport/CustReport";
import Monitor from "./components/Customer_dashboard/DeviceMoniter/Monitor";
import AlertCust from "./components/Customer_dashboard/Alert/AlertCust";

import Dashboard from "./components/Admin/Dashboard/Dashboard";
import Device from "./components/Admin/Device/Device";
import Gateway from "./components/Admin/Gateway/Gateway";
import Sensor from "./components/Admin/Sensor/Sensor";
import Report from "./components/Admin/Reports/Report";
import User from "./components/Admin/User/User";
import Setting from "./components/Admin/Profile/Profile";
import AddDevice from "./components/Admin/Device/AddDevice";
import AddUser from "./components/Admin/User/AddUser";
import UpdateDevice from "./components/Admin/Device/UpdateDevice";
import UpdateGateway from "./components/Admin/Gateway/UpdateGateway";
import UpdateSensor from "./components/Admin/Sensor/UpdateSensor";



function App() {
  const [userRole, setUserRole] = useState("");

  const handleLogin = () => setUserRole("admin");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route path="/auth/Register" element={<Register />} />
        <Route path="/auth/Forgot" element={<Forgot />} />

        <Route
          path="/Dashboard"
          element={
            userRole === "admin" ? <Dashboard /> : <Navigate to="/auth/Login" />
          }
        />
        <Route path="/Customer_dashboard" element={<Customer_dashboard />} />
        <Route path="/CustProfile" element={<CustProfile />} />
        <Route path="/CustReport" element={<CustReport />} />
        <Route path="/AlertCust" element={<AlertCust />} />
        <Route path="/DeviceMoniter" element={<DeviceMoniter />} />
        <Route path="/Log/:id" element={<Log />} />
        <Route path="/Device/updateDevice/:id" element={<UpdateDevice />} />
        <Route path="/Gateway/UpdateGateway/:id" element={<UpdateGateway />} />
        <Route path="/Monitor/:deviceId" element={<Monitor />} />
        <Route path="/DeviceDetails/:id" element={<DeviceDetails />} />

        <Route path="/Device/Device" element={<Device />} />
        <Route path="/Device/AddDevice" element={<AddDevice />} />
        <Route path="/User/AddUser" element={<AddUser />} />
        <Route path="/Gateway/Gateway" element={<Gateway />} />
        <Route path="/Sensor/Sensor" element={<Sensor />} />
      

        <Route path="/Reports/Report" element={<Report />} />
        <Route path="/User/User" element={<User />} />
        <Route path="/Profile/profile" element={<Setting />} />
       
        {/* Add the route for UpdateSensor */}
        <Route path="/UpdateSensor/:id" element={<UpdateSensor />} />
      </Routes>
    </Router>
  );
}

export default App;
