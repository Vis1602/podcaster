const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const verifyToken = require('../middleware/auth');

// File upload routes
router.post('/audio', verifyToken, upload.single('audio'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        
        if (!req.file.mimetype.startsWith('audio/')) {
            return res.status(400).json({ message: 'File must be an audio file' });
        }
        
        // Create file URL
        const fileUrl = `http://localhost:${process.env.PORT || 5000}/uploads/${req.file.filename}`;
        
        res.json({
            message: 'File uploaded successfully',
            fileUrl: fileUrl
        });
    } catch (err) {
        res.status(500).json({ message: 'Error uploading file', error: err.message });
    }
});

router.post('/image', verifyToken, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        
        if (!req.file.mimetype.startsWith('image/')) {
            return res.status(400).json({ message: 'File must be an image' });
        }
        
        // Create file URL
        const fileUrl = `http://localhost:${process.env.PORT || 5000}/uploads/${req.file.filename}`;
        
        res.json({
            message: 'Image uploaded successfully',
            fileUrl: fileUrl
        });
    } catch (err) {
        res.status(500).json({ message: 'Error uploading image', error: err.message });
    }
});

module.exports = router; 