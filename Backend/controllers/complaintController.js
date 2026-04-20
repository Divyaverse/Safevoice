const fs = require("fs");
const path = require("path");
const generateId = require("../utils/generateId");
const { uploadToS3 } = require("./uploadController");

const filePath = path.join(__dirname, "../complaints.json");

// CREATE COMPLAINT
exports.createComplaint = async (req, res) => {
    try {
        const { description, category } = req.body;

        // ✅ Basic validation
        if (!description || !category) {
            return res.status(400).json({
                success: false,
                message: "Description and category are required",
            });
        }

        let fileData = null;

        // ✅ Upload only if file exists
        if (req.file) {
            fileData = await uploadToS3(req.file);
        }

        const newComplaint = {
            id: generateId(),
            description,
            category,
            fileUrl: fileData ? fileData.fileUrl : null,
            status: "Pending",
            createdAt: new Date(),
        };

        let complaints = [];

        // ✅ Safe read
        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, "utf-8");
            complaints = fileContent ? JSON.parse(fileContent) : [];
        }

        complaints.push(newComplaint);

        fs.writeFileSync(filePath, JSON.stringify(complaints, null, 2));

        res.json({
            success: true,
            message: "Complaint submitted successfully",
            complaint: newComplaint,
        });

    } catch (error) {
        console.error("❌ ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Error submitting complaint",
        });
    }
};


// GET ALL COMPLAINTS
exports.getComplaints = (req, res) => {
    try {
        if (!fs.existsSync(filePath)) {
            return res.json({
                success: true,
                message: "No complaints found",
                data: []
            });
        }

        const fileContent = fs.readFileSync(filePath, "utf-8");
        const data = fileContent ? JSON.parse(fileContent) : [];

        res.json({
            success: true,
            message: "Complaints fetched successfully",
            data: data
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error fetching complaints",
        });
    }
};

// GET COMPLAINT BY ID
exports.getComplaintById = (req, res) => {
    try {
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ success: false, message: "Complaint not found" });
        }

        const fileContent = fs.readFileSync(filePath, "utf-8");
        const data = fileContent ? JSON.parse(fileContent) : [];
        const complaint = data.find(c => c.id === req.params.id);

        if (!complaint) {
            return res.status(404).json({ success: false, message: "Complaint not found" });
        }

        res.json({
            success: true,
            message: "Complaint fetched successfully",
            data: complaint
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error fetching complaint details" });
    }
};

// GET ANALYTICS
exports.getAnalytics = (req, res) => {
    try {
        if (!fs.existsSync(filePath)) {
            return res.json({
                success: true,
                message: "Analytics fetched successfully",
                data: {
                    total: 0,
                    pending: 0,
                    resolved: 0,
                    withAttachments: 0
                }
            });
        }

        const fileContent = fs.readFileSync(filePath, "utf-8");
        const data = fileContent ? JSON.parse(fileContent) : [];
        
        const analytics = {
            total: data.length,
            pending: data.filter(c => c.status === "Pending").length,
            resolved: data.filter(c => c.status === "Resolved").length,
            withAttachments: data.filter(c => c.fileUrl !== null).length
        };

        res.json({
            success: true,
            message: "Analytics fetched successfully",
            data: analytics
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error fetching analytics" });
    }
};

// UPDATE STATUS
exports.updateComplaintStatus = (req, res) => {
    try {
        const { status } = req.body;
        
        // Allowed statuses based on Admin Dashboard screenshot
        if (!status || !["Pending", "Resolved", "In Progress"].includes(status)) {
            return res.status(400).json({ success: false, message: "Valid status required (Pending, Resolved, or In Progress)" });
        }

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ success: false, message: "Complaint not found" });
        }

        const fileContent = fs.readFileSync(filePath, "utf-8");
        const data = fileContent ? JSON.parse(fileContent) : [];
        
        const complaintIndex = data.findIndex(c => c.id === req.params.id);
        
        if (complaintIndex === -1) {
            return res.status(404).json({ success: false, message: "Complaint not found" });
        }

        data[complaintIndex].status = status;

        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

        res.json({
            success: true,
            message: "Complaint status updated successfully",
            data: data[complaintIndex]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error updating complaint status" });
    }
};