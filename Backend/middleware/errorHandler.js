const errorHandler = (err, req, res, next) => {
    console.error("❌ Error:", err);

    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
        stack: process.env.NODE_ENV === "development" ? err.stack : null
    });
};

module.exports = errorHandler;