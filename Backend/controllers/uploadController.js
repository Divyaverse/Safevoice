exports.uploadToS3 = async (file) => {
    try {
        if (!file) return null;

        const s3 = require("../config/aws");
        const { v4: uuidv4 } = require("uuid");

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `complaints/${uuidv4()}-${file.originalname}`,
            Body: file.buffer,
            ContentType: file.mimetype,
            // 🔥 IMPORTANT: allow frontend to access file
            ACL: "public-read",
        };

        const data = await s3.upload(params).promise();

        return {
            fileUrl: data.Location,
            key: data.Key,
        };

    } catch (error) {
        console.error("❌ S3 Upload Error:", error);
        throw error; // VERY IMPORTANT
    }
};