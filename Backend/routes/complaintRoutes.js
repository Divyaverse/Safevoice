const express = require("express");
const router = express.Router();
const multer = require("multer");

const upload = multer();

const {
    createComplaint,
    getComplaints,
    getComplaintById,
    getAnalytics,
    updateComplaintStatus
} = require("../controllers/complaintController");

// Create complaint (with optional file)
router.post("/complaint", upload.single("file"), createComplaint);

// Get all complaints (admin)
router.get("/complaints", getComplaints);

// 🔥 Track complaint by ID
router.get("/complaint/:id", getComplaintById);

// Analytics
router.get("/analytics", getAnalytics);

// Update status
router.put("/complaint/:id", updateComplaintStatus);

module.exports = router;