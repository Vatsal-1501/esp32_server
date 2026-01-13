const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;

// 1. Ensure the uploads directory exists relative to the script
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// 2. Increase the limit for raw data
app.use(express.raw({ type: 'application/octet-stream', limit: '20mb' }));

app.post('/upload', (req, res) => {
    try {
        const fileName = req.headers['x-file-name'] || `log_${Date.now()}.txt`;
        const filePath = path.join(uploadDir, fileName);

        console.log(`Receiving file: ${fileName} (${req.body.length} bytes)`);

        if (!req.body || req.body.length === 0) {
            console.error("Empty body received");
            return res.status(400).send("No data received");
        }

        fs.writeFileSync(filePath, req.body);
        
        console.log(`Successfully saved to: ${filePath}`);
        res.status(200).send("Upload Successful");
    } catch (error) {
        console.error("UPLOAD CRASH:", error);
        res.status(500).send("Internal Server Error: " + error.message);
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server active on port ${PORT}`);
});