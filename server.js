const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to handle file uploads
app.post('/upload', upload.array('files[]', 12), (req, res) => {
    res.status(200).json({ message: 'Files uploaded successfully!' });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
