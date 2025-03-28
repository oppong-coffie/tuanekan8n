const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const invoiceRoutes = require("./routes/route");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/", invoiceRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
