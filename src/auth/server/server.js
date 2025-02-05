const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const multer = require("multer");
const xlsx = require("xlsx");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
// const moment = require("moment-timezone");
// const twilio = require("twilio");

const app = express();
const port = 3001;

const secretKey = crypto.randomBytes(32).toString("hex");
console.log("Generated secret key:", secretKey);

app.use(bodyParser.json({ limit: "200mb" }));
app.use(cors());
app.use(cookieParser());
app.use(
  session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 3600000,
      httpOnly: true,
    },
  })
);

app.use((req, res, next) => {
  req.userId = req.session.user_id; // Corrected to use user_id
  next();
});

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "myproject",
  password: "1978",
  port: 5432,
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Helper function to format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toISOString();
}
global.uId = 0;
global.AId = 0;

// //////////////////////////////////////////////////////////////////////////////
// const setUserId = async (req, res, next) => {
//   try {
//     const userId = uId;
//     console.log("User ID:", userId);
//     if (userId) {
//       const result = await pool.query(
//         "SELECT user_id FROM tblusermst WHERE user_id = $1",
//         [userId]
//       );
//       console.log("Query result:", result.rows);
//       if (result.rows.length > 0) {
//         req.session.user_id = result.rows[0].user_id; // Corrected to use user_id
//         console.log("User ID set:", req.session.user_id);
//       }
//     }
//   } catch (error) {
//     console.error("Error fetching userId:", error);
//   }
//   next();
// };

const verifyToken = (req, res, next) => {
  const token = req.cookies.token || req.session.token;
  if (token) {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        console.error("Failed to authenticate token.");
        return res
          .status(401)
          .send({ success: false, message: "Unauthorized" });
      } else {
        req.session.token = token;
        req.session.username = decoded.username;
        req.session.role = decoded.role;
        next();
      }
    });
  } else {
    console.error("No token provided.");
    return res.status(403).send({ success: false, message: "Forbidden" });
  }
};

// Middleware function to log request details
const logRequest = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};

// Middleware function to handle errors
const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ success: false, message: "Internal Server Error" });
};

app.use(logRequest);
app.use("/secure", verifyToken);

///////////////////////////////////////////////////////////////////////////////
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log("Received credentials:", { username, password });

  try {
    let result;

    // Check if the user is an Admin
    result = await pool.query(
      "SELECT user_id, username, role_id FROM tblusermst WHERE username = $1 AND password = $2",
      [username, password]
    );

    if (result.rows.length > 0) {
      const user = result.rows[0];
      req.session.user_id = user.user_id;
      AId = user.user_id;

      if (user.role_id === 1) {
        const token = jwt.sign({ username, role_name: "admin" }, secretKey, {
          expiresIn: "1h",
        });
        req.session.token = token;

        req.session.role = user.role_name;

        res.cookie("token", token);
        res.cookie("username", username);
        res.cookie("password", password);
        res.status(200).json({
          success: true,
          message: "Login successful",
          user: { ...user, role_name: "admin" },
          token,
        });
        console.log("Login successful for Admin");
        return;
      }
    }

    result = await pool.query(
      "SELECT customer_id, username, role_id FROM tblcustomermst  WHERE username = $1 AND password = $2",
      [username, password]
    );

    if (result.rows.length > 0) {
      const customer = result.rows[0];
      req.session.user_id = customer.customer_id;

      uId = customer.customer_id;
      const token = jwt.sign({ username, role_name: "customer" }, secretKey, {
        expiresIn: "1h",
      });
      req.session.token = token;
      req.session.username = username;
      req.session.role = customer.role_name;

      res.cookie("token", token);
      res.cookie("username", username);
      res.cookie("password", password);
      res.status(200).json({
        success: true,
        message: "Login successful",
        user: { ...customer, role_name: "customer" },
        token,
      });
      console.log("Login successful for Customer");
      return;
    }

    // If no matching user found
    res.status(401).json({ success: false, message: "Invalid credentials" });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

app.get("/customer-info", async (req, res) => {
  try {
    const userId = uId;
    console.log("Customer ID:", userId);

    const query = `
      SELECT COUNT(DISTINCT d.device_id) AS device_count, COUNT(DISTINCT g.gateway_id) AS gateway_count
      FROM tbldevicemst d
      JOIN tblgatewaymst g ON d.gateway_id = g.gateway_id
      WHERE g.customer_id = $1
    `;

    const result = await pool.query(query, [userId]);

    const deviceCount = result.rows[0].device_count;
    const gatewayCount = result.rows[0].gateway_count;

    res.status(200).json({ deviceCount, gatewayCount });
  } catch (error) {
    console.error("Error fetching customer information:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/devices", async (req, res) => {
  try {
    const userId = uId;
    console.log("User Device ID:", userId);

    const query = `
    SELECT d.* 
    FROM tbldevicemst d
    INNER JOIN tblgatewaymst g ON d.gateway_id = g.gateway_id
    WHERE g.customer_id = $1
  `;

    const { rows } = await pool.query(query, [userId]);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching devices:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/register", async (req, res) => {
  const {
    username,
    password,
    fullName,
    contact1,
    contact2,
    address,
    location,
    accountDetails,
    remarks,
  } = req.body;

  try {
    // Check if the username already exists
    const usernameCheck = await pool.query(
      "SELECT * FROM tblcustomermst WHERE username = $1",
      [username]
    );

    if (usernameCheck.rows.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Username already taken" });
    }

    // Insert user data into the database
    const result = await pool.query(
      "INSERT INTO tblcustomermst (username, password,  customer_name, customer_contact_1, customer_contact_2, customer_address, customer_location, customer_account_details, remarks, role_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
      [
        username,
        password,
        fullName,
        contact1,
        contact2,
        address,
        location,
        accountDetails,
        remarks,
        2, // Default role ID
      ]
    );

    res.status(201).json({
      success: true,
      message: "User added successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

app.get("/checkUsername", async (req, res) => {
  const { username } = req.query;

  try {
    // Check if the username already exists in the database
    const result = await pool.query(
      "SELECT * FROM tblcustomermst WHERE username = $1",
      [username]
    );

    // If the username already exists, it's not available
    const isUsernameAvailable = result.rows.length === 0;

    res.json({ available: isUsernameAvailable });
  } catch (error) {
    console.error("Error checking username availability:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint for handling bulk insert
app.post("/bulkImport", upload.single("file"), async (req, res) => {
  console.log(req);
  try {
    const fileBuffer = req.file.buffer;
    const workbook = xlsx.read(fileBuffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet, { header: "A" });

    console.log("CSV Data:", data); // Log CSV data for debugging

    const insertQuery =
      "INSERT INTO tblDeviceMst(device_name, gateway_id, manufacturer, model, serial_number, firmware_version, manufacturing_date, purchase_date, warranty_expiry_date, additional_details, remarks) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)";

    for (const row of data.slice(1)) {
      // Skip header row
      try {
        const values = Object.values(row);

        // Convert date columns to valid format
        values[6] = formatDate(values[6]); // manufacturing_date
        values[7] = formatDate(values[7]); // purchase_date
        values[8] = formatDate(values[8]); // warranty_expiry_date

        console.log("Inserting Row:", values);
        await pool.query(insertQuery, values);
      } catch (error) {
        console.error("Error inserting row:", row);
        console.error(error);
      }
    }

    res.status(200).send("Bulk import successful");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/customers", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tblcustomermst");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

app.get("/gatewayIds", async (req, res) => {
  try {
    const result = await pool.query("SELECT gateway_id FROM tblGatewayMst");

    const gatewayIds = result.rows.map((row) => row.gateway_id);
    res.status(200).json(gatewayIds);
  } catch (error) {
    console.error("Error fetching gateway IDs:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.get("/admin/gateways", async (req, res) => {
  try {
    // Write your SQL query to fetch gateways from the database
    const query = "SELECT * FROM tblGatewayMst";

    // Execute the query using the connection pool
    const { rows } = await pool.query(query);

    // Send the fetched gateways as a JSON response
    res.json(rows);
  } catch (error) {
    console.error("Error fetching Gateways:", error);
    // Handle errors by sending an appropriate error response
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/customers/:id", async (req, res) => {
  const customerId = req.params.id;
  try {
    const result = await pool.query(
      "SELECT * FROM tblcustomermst WHERE customer_id = $1",
      [customerId]
    );
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ message: "Customer not found" });
    }
  } catch (error) {
    console.error("Error fetching customer details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/devicesDropdown", async (req, res) => {
  try {
    const devices = await pool.query("SELECT * FROM tblDeviceMst");
    res.json(devices.rows);
  } catch (error) {
    console.error("Error fetching devices:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/addSensor", async (req, res) => {
  const { sensorName, sensorCalibration, deviceId } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO tblSensorMst (sensor_name, sensor_calibration_value, device_id) VALUES ($1, $2, $3) RETURNING *",
      [sensorName, sensorCalibration, deviceId]
    );

    res.json({ message: "Sensor added successfully", sensor: result.rows[0] });
  } catch (error) {
    console.error("Error adding sensor:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/admin/devices", async (req, res) => {
  try {
    // Write your SQL query to fetch devices from the database
    const query = "SELECT * FROM tblDeviceMst";

    // Execute the query using the connection pool
    const { rows } = await pool.query(query);

    // Send the fetched devices as a JSON response
    res.json(rows);
  } catch (error) {
    console.error("Error fetching devices:", error);
    // Handle errors by sending an appropriate error response
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/customersDropdown", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT customer_id, customer_name FROM tblCustomerMst"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/addGateway", async (req, res) => {
  const { gatewayName, customerId } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO tblGatewayMst (gateway_name, customer_id) VALUES ($1, $2) RETURNING *",
      [gatewayName, customerId]
    );

    res.json({
      message: "Gateway added successfully",
      gateway: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/customer/device/fetch", async (req, res) => {
  try {
    // Query to fetch devices
    const query = "SELECT * FROM tblDeviceMst";
    const { rows } = await pool.query(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching devices:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/addDevice", async (req, res) => {
  const {
    deviceName,
    gatewayId,
    manufacturer,
    model,
    serialNumber,
    firmwareVersion,
    manufacturingDate,
    purchaseDate,
    warrantyExpiryDate,
    additionalDetails,
    remarks,
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO tblDeviceMst 
          (device_name, gateway_id, manufacturer, model, serial_number, firmware_version, 
          manufacturing_date, purchase_date, warranty_expiry_date, additional_details, remarks)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [
        deviceName,
        gatewayId,
        manufacturer,
        model,
        serialNumber,
        firmwareVersion,
        manufacturingDate,
        purchaseDate,
        warrantyExpiryDate,
        additionalDetails,
        remarks,
      ]
    );

    res.json({ message: "Device added successfully", device: result.rows[0] });
  } catch (error) {
    console.error("Error adding device:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/devices/:id", async (req, res) => {
  const deviceId = req.params.id;
  try {
    const result = await pool.query(
      "DELETE FROM tblDeviceMst WHERE device_id = $1 RETURNING *",
      [deviceId]
    );
    if (result.rows.length > 0) {
      res.status(200).json({
        message: "Device deleted successfully",
        deletedDevice: result.rows[0],
      });
    } else {
      res.status(404).json({ message: "Device not found" });
    }
  } catch (error) {
    console.error("Error deleting device:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/devices/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const query = "SELECT * FROM tbldevicemst WHERE device_id = $1";
    const { rows } = await pool.query(query, [id]);
    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching device:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/logs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { page, pageSize } = req.query;
    const offset = (page - 1) * pageSize; // Calculate offset

    const query = `
    SELECT 
    ld.log_detail_id AS "Log Detail ID",
    lm.log_id AS "Log ID",
    lm.timestamp AS "Timestamp",
    lm.log_data AS "Log Data"
FROM 
    tbllogdetails ld
JOIN 
    tbllogmst lm ON ld.log_id = lm.log_id
WHERE 
    lm.device_id = $1
ORDER BY 
    lm.timestamp DESC;
`;

    const { rows } = await pool.query(query, [id]);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/admin/devices/:id", async (req, res) => {
  const deviceId = req.params.id;
  try {
    const result = await pool.query(
      "DELETE FROM tblDeviceMst WHERE device_id = $1 RETURNING *",
      [deviceId]
    );
    if (result.rows.length > 0) {
      res.status(200).json({
        message: "Device deleted successfully",
        deletedDevice: result.rows[0],
      });
    } else {
      res.status(404).json({ message: "Device not found" });
    }
  } catch (error) {
    console.error("Error deleting device:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update device
app.put("/admin/devices/:id", async (req, res) => {
  const deviceId = req.params.id;
  const {
    device_name,
    gateway_id,
    manufacturer,
    model,
    serial_number,
    firmware_version,
    manufacturing_date,
    purchase_date,
    warranty_expiry_date,
    additional_details,
    remarks,
  } = req.body; // Added gateway_id
  try {
    const result = await pool.query(
      `UPDATE tblDeviceMst 
        SET device_name = $1, gateway_id = $2, manufacturer = $3, model = $4, serial_number = $5, firmware_version = $6, manufacturing_date = $7, purchase_date = $8, warranty_expiry_date = $9, additional_details = $10, remarks = $11
        WHERE device_id = $12
        RETURNING *`,
      [
        device_name,
        gateway_id,
        manufacturer,
        model,
        serial_number,
        firmware_version,
        manufacturing_date,
        purchase_date,
        warranty_expiry_date,
        additional_details,
        remarks,
        deviceId,
      ]
    );
    res.status(200).json({
      message: "Device updated successfully",
      updatedDevice: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating device:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Add this route after the existing routes
app.get("/admin/devices/:id", async (req, res) => {
  const deviceId = req.params.id;
  try {
    // Write your SQL query to fetch device details by ID
    const query = "SELECT * FROM tblDeviceMst WHERE device_id = $1";
    // Execute the query using the connection pool
    const { rows } = await pool.query(query, [deviceId]);
    // Check if any rows were returned
    if (rows.length > 0) {
      // If device found, send the device details as a JSON response
      res.json(rows[0]);
    } else {
      // If device not found, send a 404 Not Found response\
      res.status(404).json({ message: "Device not found" });
    }
  } catch (error) {
    // If an error occurs, send a 500 Internal Server Error response
    console.error("Error fetching device:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/admin/gateways/:id", async (req, res) => {
  const gatewayId = req.params.id;
  try {
    await pool.query("DELETE FROM tblgatewaymst WHERE gateway_id = $1", [
      gatewayId,
    ]);
    res.json({ message: "Gateway deleted successfully" });
  } catch (error) {
    console.error("Error deleting gateway:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update Gateway
app.put("/admin/gateways/:id", async (req, res) => {
  const gatewayId = req.params.id;
  const { gatewayName, customerId } = req.body;

  try {
    // Check if the provided customer ID exists
    const customerExists = await pool.query(
      "SELECT * FROM tblCustomerMst WHERE customer_id = $1",
      [customerId]
    );

    if (customerExists.rows.length === 0) {
      return res
        .status(400)
        .json({ message: "Customer with the provided ID does not exist" });
    }

    // Update the gateway if customer exists
    const result = await pool.query(
      `UPDATE tblGatewayMst 
        SET gateway_name = $1, customer_id = $2
        WHERE gateway_id = $3
        RETURNING *`,
      [gatewayName, customerId, gatewayId]
    );
    res.status(200).json({
      message: "Gateway updated successfully",
      updatedGateway: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating gateway:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get Gateway by ID
app.get("/admin/gateways/:id", async (req, res) => {
  const gatewayId = req.params.id;
  try {
    const query = "SELECT * FROM tblGatewayMst WHERE gateway_id = $1";
    const { rows } = await pool.query(query, [gatewayId]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: "Gateway not found" });
    }
  } catch (error) {
    console.error("Error fetching gateway:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get customer by ID
app.get("/admin/customers/:id", async (req, res) => {
  const customerId = req.params.id;
  try {
    const query = "SELECT * FROM tblCustomerMst WHERE customer_id = $1";
    const { rows } = await pool.query(query, [customerId]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: "Customer not found" });
    }
  } catch (error) {
    console.error("Error fetching customer details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.delete("/customers/:id", async (req, res) => {
  const customerId = req.params.id;
  try {
    const result = await pool.query(
      "DELETE FROM tblcustomermst WHERE customer_id = $1 RETURNING *",
      [customerId]
    );
    if (result.rows.length > 0) {
      res.status(200).json({
        message: "Customer deleted successfully",
        deletedCustomer: result.rows[0],
      });
    } else {
      res.status(404).json({ message: "Customer not found" });
    }
  } catch (error) {
    console.error("Error deleting customer:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Add a new API endpoint to fetch sensor data
app.get("/admin/sensors", async (req, res) => {
  try {
    const query = `
        SELECT s.sensor_id, s.sensor_name, s.sensor_calibration_value,
              d.device_id, d.device_name
        FROM tblsensormst s
        INNER JOIN tbldevicemst d ON s.device_id = d.device_id
      `;
    const { rows } = await pool.query(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching sensors:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/admin/sensors/:sensorId", async (req, res) => {
  const sensorId = req.params.sensorId;
  try {
    const query = `DELETE FROM tblsensormst WHERE sensor_id = $1`;
    await pool.query(query, [sensorId]);
    res.status(200).json({ message: "Sensor deleted successfully" });
  } catch (error) {
    console.error("Error deleting sensor:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get Sensor by ID
app.get("/admin/sensors/:id", async (req, res) => {
  const sensorId = req.params.id;
  try {
    const query = "SELECT * FROM tblSensorMst WHERE sensor_id = $1";
    const { rows } = await pool.query(query, [sensorId]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: "Sensor not found" });
    }
  } catch (error) {
    console.error("Error fetching sensor details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update Sensor
app.put("/admin/sensors/:id", async (req, res) => {
  const sensorId = req.params.id;
  const {
    sensor_name,
    sensor_calibration_value,
    device_id,

    // Add other fields here if necessary
  } = req.body;
  try {
    const query =
      "UPDATE tblSensorMst SET sensor_name = $1, sensor_calibration_value = $2, device_id = $3  WHERE sensor_id = $4 RETURNING *";
    const values = [sensor_name, sensor_calibration_value, device_id, sensorId];
    const result = await pool.query(query, values);
    if (result.rows.length > 0) {
      res.status(200).json({
        message: "Sensor updated successfully",
        updatedSensor: result.rows[0],
      });
    } else {
      res.status(404).json({ message: "Sensor not found" });
    }
  } catch (error) {
    console.error("Error updating sensor:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/dashboard_data", async (req, res) => {
  try {
    const devicesQuery = "SELECT COUNT(*) AS device_count FROM tbldevicemst";
    const sensorsQuery = "SELECT COUNT(*) AS sensor_count FROM tblsensormst";
    const gatewaysQuery = "SELECT COUNT(*) AS gateway_count FROM tblgatewaymst";
    const custcountQuery = "SELECT COUNT(*) AS cust_count FROM tblcustomermst";
    const usersQuery = "SELECT * FROM tblcustomermst";

    const devicesResult = await pool.query(devicesQuery);
    const sensorsResult = await pool.query(sensorsQuery);
    const gatewaysResult = await pool.query(gatewaysQuery);
    const custResult = await pool.query(custcountQuery);
    const usersResult = await pool.query(usersQuery);

    const dashboardData = {
      devicesCount: devicesResult.rows[0].device_count,
      sensorsCount: sensorsResult.rows[0].sensor_count,
      gatewaysCount: gatewaysResult.rows[0].gateway_count,
      custcount: custResult.rows[0].cust_count,
      users: usersResult.rows,
    };

    res.json(dashboardData);
  } catch (error) {
    console.error("Error fetching dashboard data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Assuming this is your server-side code
app.post("/generate-tps-day-report", async (req, res) => {
  const { startDate, endDate } = req.body;

  try {
    let tpsDayReportQuery = `
      SELECT 
        DATE_TRUNC('day', l.timestamp) AS time_interval, 
        d.device_id,
        d.device_name,
        COUNT(l.device_id) AS count,
        AVG(CAST(l.log_data AS NUMERIC)) AS avg_temperature
      FROM tbldevicemst d
      LEFT JOIN tbllogmst l ON d.device_id = l.device_id AND l.timestamp >= $1 AND l.timestamp <= $2
      JOIN tblgatewaymst g ON d.gateway_id = g.gateway_id
      GROUP BY time_interval, d.device_id, d.device_name
      ORDER BY time_interval;
    `;

    const tpsDayReportData = await pool.query(tpsDayReportQuery, [
      startDate,
      endDate,
    ]);

    res.json({ success: true, data: tpsDayReportData.rows });
  } catch (error) {
    console.error("Error generating TPS day report:", error);
    res
      .status(500)
      .json({ success: false, error: "Error generating TPS day report" });
  }
});

app.post("/generate-tps-week-report", async (req, res) => {
  const { startDate, endDate } = req.body;

  try {
    let tpsWeekReportQuery = `
      SELECT 
        DATE_TRUNC('week', l.timestamp) AS time_interval, 
        d.device_id,
        d.device_name,
        COUNT(l.device_id) AS count,
        AVG(CAST(l.log_data AS NUMERIC)) AS avg_temperature
      FROM tbldevicemst d
      LEFT JOIN tbllogmst l ON d.device_id = l.device_id AND l.timestamp >= $1 AND l.timestamp <= $2
      JOIN tblgatewaymst g ON d.gateway_id = g.gateway_id
      GROUP BY time_interval, d.device_id, d.device_name
      ORDER BY time_interval;
    `;

    const tpsWeekReportData = await pool.query(tpsWeekReportQuery, [
      startDate,
      endDate,
    ]);

    res.json({ success: true, data: tpsWeekReportData.rows });
  } catch (error) {
    console.error("Error generating TPS week report:", error);
    res
      .status(500)
      .json({ success: false, error: "Error generating TPS week report" });
  }
});

app.post("/generate-mis-report", async (req, res) => {
  const { startDate, endDate } = req.body;

  try {
    let misReportQuery = `
      SELECT 
        DATE_TRUNC('month', l.timestamp) AS month,
        d.device_id,
        d.device_name,
        COUNT(l.device_id) AS log_count,
        AVG(l.log_data::numeric) AS avg_temperature
      FROM tbldevicemst d
      LEFT JOIN tbllogmst l ON d.device_id = l.device_id AND l.timestamp >= $1 AND l.timestamp <= $2
      GROUP BY month, d.device_id, d.device_name
      ORDER BY month;
    `;

    const misReportData = await pool.query(misReportQuery, [
      startDate,
      endDate,
    ]);

    res.json({ success: true, data: misReportData.rows });
  } catch (error) {
    console.error("Error generating MIS report:", error);
    res
      .status(500)
      .json({ success: false, error: "Error generating MIS report" });
  }
});

app.post("/generate-dss-report", async (req, res) => {
  const { startDate, endDate } = req.body;

  try {
    let dssReportQuery = `
      SELECT 
        d.device_id,
        d.device_name,
        COUNT(l.device_id) AS log_count,
        AVG(CAST(l.log_data AS NUMERIC)) AS avg_temperature
      FROM tbldevicemst d
      LEFT JOIN tbllogmst l ON d.device_id = l.device_id AND l.timestamp >= $1 AND l.timestamp <= $2
      GROUP BY d.device_id, d.device_name
      ORDER BY log_count DESC;
    `;

    const dssReportData = await pool.query(dssReportQuery, [
      startDate,
      endDate,
    ]);

    res.json({ success: true, data: dssReportData.rows });
  } catch (error) {
    console.error("Error generating DSS report:", error);
    res
      .status(500)
      .json({ success: false, error: "Error generating DSS report" });
  }
});

app.post("/generateReport", async (req, res) => {
  try {
    const { startDate, endDate, reportType } = req.body;
    const userId = uId; // Assuming the session contains user ID

    let query;
    let reportData;

    switch (reportType) {
      case "TPS Day":
        query = `
          SELECT DATE_TRUNC('day', l.timestamp) AS day, 
                 d.device_id, 
                 d.device_name, 
                 COUNT(*) AS log_count, 
                 AVG(CAST(l.log_data AS NUMERIC)) AS avg_temperature
          FROM tbllogmst l
          JOIN tbldevicemst d ON l.device_id = d.device_id
          JOIN tblgatewaymst g ON d.gateway_id = g.gateway_id
          WHERE l.timestamp >= $1 AND l.timestamp <= $2 
          AND g.customer_id = $3
          GROUP BY day, d.device_id, d.device_name
          ORDER BY day`;
        reportData = await pool.query(query, [startDate, endDate, userId]);
        break;

      case "TPS Week":
        query = `
          SELECT DATE_TRUNC('week', l.timestamp) AS week, 
                 d.device_id, 
                 d.device_name, 
                 COUNT(*) AS log_count, 
                 AVG(CAST(l.log_data AS NUMERIC)) AS avg_temperature
          FROM tbllogmst l
          JOIN tbldevicemst d ON l.device_id = d.device_id
          JOIN tblgatewaymst g ON d.gateway_id = g.gateway_id
          WHERE l.timestamp >= $1 AND l.timestamp <= $2 
          AND g.customer_id = $3
          GROUP BY week, d.device_id, d.device_name
          ORDER BY week`;
        reportData = await pool.query(query, [startDate, endDate, userId]);
        break;

      case "MIS":
        query = `
            SELECT DATE_TRUNC('month', l.timestamp) AS month, 
                   d.device_id,
                   d.device_name,
                   COUNT(*) AS log_count,
                   AVG(CAST(l.log_data AS NUMERIC)) AS avg_temperature
            FROM tbllogmst l
            JOIN tbldevicemst d ON l.device_id = d.device_id
            JOIN tblgatewaymst g ON d.gateway_id = g.gateway_id
            WHERE l.timestamp >= $1 AND l.timestamp <= $2 
            AND g.customer_id = $3
            GROUP BY month, d.device_id, d.device_name
            ORDER BY month`;
        reportData = await pool.query(query, [startDate, endDate, userId]);
        break;

      case "DSS":
        query = `
          SELECT d.device_id, 
                 d.device_name, 
                 COUNT(*) AS log_count, 
                 AVG(CAST(l.log_data AS NUMERIC)) AS avg_temperature
          FROM tbllogmst l
          JOIN tbldevicemst d ON l.device_id = d.device_id
          JOIN tblgatewaymst g ON d.gateway_id = g.gateway_id
          WHERE l.timestamp >= $1 AND l.timestamp <= $2 
          AND g.customer_id = $3
          GROUP BY d.device_id, d.device_name`;
        reportData = await pool.query(query, [startDate, endDate, userId]);
        break;

      default:
        return res.status(400).json({ message: "Invalid report type" });
    }

    res.status(200).json({ data: reportData.rows });
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/temperature-data", async (req, res) => {
  try {
    const userId = uId;
    const { deviceId } = req.query; // Get the device ID from query params

    console.log("Customer ID:", userId);

    let query;
    const params = [userId];

    if (!deviceId) {
      // Query for fetching average temperature across all devices for all timestamps
      query = `
    SELECT timestamp, AVG(temperature) AS temperature
    FROM (
      SELECT timestamp, log_data::float AS temperature
      FROM tbllogmst lm
      JOIN tbldevicemst dm ON lm.device_id = dm.device_id
      JOIN tblgatewaymst gm ON dm.gateway_id = gm.gateway_id
      WHERE gm.customer_id = $1
      ORDER BY timestamp DESC
      LIMIT 100
    ) AS temperatures
    GROUP BY timestamp
    ORDER BY timestamp
  `;
    } else {
      // Query for fetching temperature data for a specific device
      query = `
        SELECT timestamp, log_data::float AS temperature
        FROM tbllogmst lm
        JOIN tbldevicemst dm ON lm.device_id = dm.device_id
        JOIN tblgatewaymst gm ON dm.gateway_id = gm.gateway_id
        WHERE gm.customer_id = $1 AND lm.device_id = $2
        ORDER BY log_id DESC LIMIT 50
      `;
      params.push(deviceId);
      console.log("Device ID:", deviceId);
    }

    const result = await pool.query(query, params);
    const temperatureData = result.rows;

    res.status(200).json(temperatureData);
  } catch (error) {
    console.error("Error fetching temperature data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Add a new endpoint to handle temperature data from IoT devices
// const client = twilio(
//   "",
//   ""
// ); //auth id and token

// Middleware
app.use(bodyParser.json());

// Endpoint to receive temperature data from IoT device

app.get("/temperature-iotdevice", async (req, res) => {
  try {
    // Extract data from query parameters
    let { device_id, log_data } = req.query;

    // Convert data types
    device_id = parseInt(device_id); // Convert device_id to integer

    // Get current timestamp in Gujarat time zone (IST)
    const currentISTTime = getCurrentISTTime();

    // Insert temperature data into the log table
    const insertLogQuery = `
      INSERT INTO tbllogmst (device_id, timestamp, log_data) VALUES ($1, $2, $3)
      RETURNING log_id;`;
    const insertLogParams = [device_id, currentISTTime, log_data];
    const logResult = await pool.query(insertLogQuery, insertLogParams);
    const logId = logResult.rows[0].log_id; // Retrieve the inserted log_id

    // Insert temperature data into the log details table
    const insertDetailsQuery = `
      INSERT INTO tbllogdetails (log_id, timestamp, log_data) VALUES ($1, $2, $3)
    `;
    const insertDetailsParams = [logId, currentISTTime, log_data];
    await pool.query(insertDetailsQuery, insertDetailsParams);

    // Check if temperature exceeds limits
    const temperatureLimitQuery = `
      SELECT max_temp, min_temp, customer_id
      FROM tbluseralertsmst AS uam
      JOIN tblgatewaymst AS gm ON uam.device_id = gm.gateway_id
      WHERE gm.gateway_id = $1
    `;
    const temperatureLimitParams = [device_id];

    // Execute temperature limit query
    const result = await pool.query(
      temperatureLimitQuery,
      temperatureLimitParams
    );

    // Check if any rows returned
    if (result.rows.length === 0) {
      console.log("No temperature limits found for this device.");
      return res
        .status(200)
        .json({ message: "Temperature data inserted successfully" });
    }

    // Extract temperature limits and customer ID from the result
    const { max_temp, min_temp, customer_id } = result.rows[0];

    // Check if max_temp or min_temp is null or undefined
    if (
      max_temp === null ||
      max_temp === undefined ||
      min_temp === null ||
      min_temp === undefined
    ) {
      console.log("Temperature limits are not set. Skipping notification.");
      // Return a 400 status code to indicate a bad request
      return res
        .status(400)
        .json({ error: "Temperature limits are not set for this device" });
    }

    const temperature = parseFloat(log_data); // Assuming log_data contains temperature as a float

    // Check if temperature exceeds limits
    if (temperature > max_temp || temperature < min_temp) {
      // Fetch customer's contact number from database
      const customerPhoneQuery = `
        SELECT customer_contact_1 FROM tblcustomermst WHERE customer_id = $1
      `;
      const customerPhoneParams = [customer_id];
      const customerPhoneResult = await pool.query(
        customerPhoneQuery,
        customerPhoneParams
      );
      const customerPhoneNumber =
        customerPhoneResult.rows[0].customer_contact_1; // Assuming customer_contact_1 is the phone number

      // Send SMS notification
      client.messages
        .create({
          body: `Temperature limit exceeded! Current temperature: ${temperature}`,
          from: "+12565877151",
          to: "+91" + customerPhoneNumber,
        })
        .then((message) => console.log("SMS sent:", message.sid))
        .catch((error) => console.error("Error sending SMS:", error));
    }

    res.status(200).json({ message: "Temperature data inserted successfully" });
  } catch (error) {
    console.error("Error inserting temperature data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Method to get current time in IST
function getCurrentISTTime() {
  const currentUTCTime = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
  const currentISTTime = new Date(currentUTCTime.getTime() + istOffset);
  return currentISTTime;
}

app.get("/log-iotdevice/:deviceId", async (req, res) => {
  try {
    const { deviceId } = req.params;
    const query = `
      SELECT l.device_id, l.timestamp, d.device_name, l.log_data
      FROM tbllogmst l
      JOIN tbldevicemst d ON l.device_id = d.device_id
      WHERE l.device_id = $1
      ORDER BY l.log_id DESC
    `;

    const { rows } = await pool.query(query, [deviceId]);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get customer profile
app.get("/customer-profile", async (req, res) => {
  const customerId = uId;

  try {
    const query = "SELECT * FROM tblcustomermst WHERE customer_id = $1";
    const { rows } = await pool.query(query, [customerId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "An error occurred while fetching profile" });
  }
});

app.put("/update-customer-profile", async (req, res) => {
  const customerId = uId; // Retrieve customerId from session
  const updatedCustomerData = req.body;

  try {
    const query = {
      text: `
        UPDATE tblcustomermst
        SET 
          customer_name = $1,
          customer_contact_1 = $2,
          customer_contact_2 = $3,
          customer_address = $4,
          customer_location = $5,
          customer_account_details = $6
        WHERE customer_id = $7
        RETURNING *
      `,
      values: [
        updatedCustomerData.first_name, // Assuming first_name corresponds to customer_name
        updatedCustomerData.contact1,
        updatedCustomerData.contact2,
        updatedCustomerData.address,
        updatedCustomerData.location,
        updatedCustomerData.account_details,
        customerId,
      ],
    };

    const result = await pool.query(query);
    const updatedCustomer = result.rows[0];

    res.json(updatedCustomer);
  } catch (error) {
    console.error("Error updating customer profile:", error);
    res.status(500).json({ error: "Error updating customer profile" });
  }
});

app.put("/update-password", async (req, res) => {
  const { oldPassword, newPassword, confirmNewPassword } = req.body;
  const customerId = uId; // Assuming you store customer ID in the session

  try {
    // Check if old password matches stored password (assuming you store passwords in plain text)
    const customer = await pool.query(
      "SELECT * FROM tblcustomermst WHERE customer_id = $1",
      [customerId]
    );

    if (customer.rows.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const storedPassword = customer.rows[0].password;

    if (oldPassword !== storedPassword) {
      return res.status(400).json({ error: "Invalid old password" });
    }

    // Check if new password matches confirm new password
    if (newPassword !== confirmNewPassword) {
      return res
        .status(400)
        .json({ error: "New password does not match confirm password" });
    }

    // Update the password in the database
    await pool.query(
      "UPDATE tblcustomermst SET password = $1 WHERE customer_id = $2",
      [newPassword, customerId]
    );

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ error: "Error updating password" });
  }
});

app.get("/get-admin-details", async (req, res) => {
  const userId = AId;
  try {
    const result = await pool.query(
      "SELECT * FROM tblusermst WHERE user_id = $1",
      [userId]
    );
    const adminDetails = result.rows[0];
    res.json(adminDetails);
  } catch (error) {
    console.error("Error fetching admin details:", error);
    res.status(500).json({ error: "Error fetching admin details" });
  }
});

app.post("/submit-alert", async (req, res) => {
  let { maxTemp, minTemp, device_id } = req.body;
  const user_id = uId; // Assuming user_id is stored in the session

  // Convert temperature values to float
  maxTemp = parseFloat(maxTemp);
  minTemp = parseFloat(minTemp);

  try {
    // Check if an alert already exists for the user and device
    const existingAlert = await pool.query(
      "SELECT id FROM tbluseralertsmst WHERE user_id = $1 AND device_id = $2",
      [user_id, device_id]
    );

    if (existingAlert.rowCount === 1) {
      // If an alert exists, update it
      const updateQuery = `
        UPDATE tbluseralertsmst 
        SET max_temp = $1, min_temp = $2 
        WHERE user_id = $3 AND device_id = $4`;
      const updateValues = [maxTemp, minTemp, user_id, device_id];
      await pool.query(updateQuery, updateValues);
      res.status(200).json({ message: "Alert updated successfully" });
    } else {
      // If no alert exists, insert a new one
      const insertQuery = `
        INSERT INTO tbluseralertsmst (user_id, max_temp, min_temp, device_id) 
        VALUES ($1, $2, $3, $4)`;
      const insertValues = [user_id, maxTemp, minTemp, device_id];
      await pool.query(insertQuery, insertValues);
      res.status(200).json({ message: "Alert submitted successfully" });
    }
  } catch (error) {
    console.error("Error submitting alert:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Assuming you are using Express.js
app.get("/alerts", async (req, res) => {
  try {
    // Extract user_id from session
    const user_id = uId;

    // Fetch alerts from the database for the logged-in user
    const query = `
      SELECT max_temp, min_temp, device_id
      FROM tbluseralertsmst
      WHERE user_id = $1`;
    const values = [user_id];
    const result = await pool.query(query, values);

    // Send the fetched alerts as a response
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching alerts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.use(errorHandler);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});