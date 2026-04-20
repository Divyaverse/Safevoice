require("dotenv").config();

const express = require("express");
const cors = require("cors"); // ✅ ADD THIS
const errorHandler = require("./middleware/errorHandler");

const uploadRoutes = require("./routes/uploadRoutes");
const complaintRoutes = require("./routes/complaintRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", uploadRoutes);
app.use("/api", complaintRoutes);

app.get("/", (req, res) => {
    res.send("SafeVoice Backend Running 🚀");
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});