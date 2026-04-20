const express = require("express");
const router = express.Router();
const multer = require("multer");

const upload = multer();

const { uploadToS3 } = require("../controllers/uploadController"); // ✅ FIXED

router.post("/upload", upload.single("file"), async (req, res) => {
    try {
        const result = await uploadToS3(req.file);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Upload failed" });
    }
});

module.exports = router;