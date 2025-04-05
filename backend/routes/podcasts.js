const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Podcast = require('../models/Podcast');
const verifyToken = require('../middleware/auth');

// Create a new podcast
router.post('/', verifyToken, async (req, res) => {
    try {
        const { title, author, description, imageUrl, episodes } = req.body;
        
        // Log the request data and user info
        console.log('Creating podcast with data:', {
            title,
            author,
            description,
            imageUrl,
            userId: req.user.id
        });

        // Validate required fields
        if (!title || !author || !description || !imageUrl) {
            return res.status(400).json({ 
                message: 'Missing required fields',
                required: ['title', 'author', 'description', 'imageUrl'],
                received: { title, author, description, imageUrl }
            });
        }

        // Validate user ID
        if (!req.user || !req.user.id) {
            return res.status(401).json({ 
                message: 'Invalid user token',
                user: req.user
            });
        }
        
        // Check if MongoDB is connected
        if (mongoose.connection.readyState !== 1) {
            console.error('MongoDB is not connected. Current state:', mongoose.connection.readyState);
            return res.status(500).json({ 
                message: 'Database connection error',
                details: 'MongoDB is not connected'
            });
        }
        
        // Convert string ID to ObjectId
        const userId = new mongoose.Types.ObjectId(req.user.id);
        
        const newPodcast = new Podcast({
            title,
            author,
            description,
            imageUrl,
            userId: userId,
            episodes: episodes || []
        });
        
        console.log('Attempting to save podcast:', newPodcast);
        
        await newPodcast.save();
        console.log('Podcast saved successfully');
        
        res.status(201).json({ message: 'Podcast created successfully', podcast: newPodcast });
    } catch (err) {
        console.error('Error creating podcast:', err);
        console.error('Error stack:', err.stack);
        
        // Check for specific MongoDB errors
        if (err.name === 'ValidationError') {
            return res.status(400).json({ 
                message: 'Validation error', 
                details: Object.values(err.errors).map(e => e.message)
            });
        }
        
        if (err.name === 'CastError') {
            return res.status(400).json({ 
                message: 'Invalid data format', 
                details: err.message
            });
        }
        
        res.status(500).json({ 
            message: 'Server error', 
            error: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
});

// Get all podcasts (both user-uploaded and iTunes)
router.get('/', async (req, res) => {
    try {
        // Get user-uploaded podcasts
        const userPodcasts = await Podcast.find().sort({ createdAt: -1 });
        
        // For iTunes podcasts, we'll use the existing implementation in the frontend
        // This endpoint just returns the user-uploaded podcasts
        res.json({ podcasts: userPodcasts });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Get a specific podcast by ID
router.get('/:id', async (req, res) => {
    try {
        const podcast = await Podcast.findById(req.params.id);
        if (!podcast) {
            return res.status(404).json({ message: 'Podcast not found' });
        }
        res.json(podcast);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Update a podcast
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const podcast = await Podcast.findById(req.params.id);
        if (!podcast) {
            return res.status(404).json({ message: 'Podcast not found' });
        }
        
        // Check if the user is the owner of the podcast
        if (podcast.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this podcast' });
        }
        
        const updatedPodcast = await Podcast.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        
        res.json({ message: 'Podcast updated successfully', podcast: updatedPodcast });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Delete a podcast
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const podcast = await Podcast.findById(req.params.id);
        if (!podcast) {
            return res.status(404).json({ message: 'Podcast not found' });
        }
        
        // Check if the user is the owner of the podcast
        if (podcast.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this podcast' });
        }
        
        await Podcast.findByIdAndDelete(req.params.id);
        res.json({ message: 'Podcast deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Add an episode to a podcast
router.post('/:id/episodes', verifyToken, async (req, res) => {
    try {
        const podcast = await Podcast.findById(req.params.id);
        if (!podcast) {
            return res.status(404).json({ message: 'Podcast not found' });
        }
        
        // Check if the user is the owner of the podcast
        if (podcast.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to add episodes to this podcast' });
        }
        
        const { title, description, audioUrl, duration } = req.body;
        
        podcast.episodes.push({
            title,
            description,
            audioUrl,
            duration,
            releaseDate: new Date()
        });
        
        await podcast.save();
        res.json({ message: 'Episode added successfully', podcast });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Delete an episode from a podcast
router.delete('/:id/episodes/:episodeId', verifyToken, async (req, res) => {
    try {
        const podcast = await Podcast.findById(req.params.id);
        if (!podcast) {
            return res.status(404).json({ message: 'Podcast not found' });
        }
        
        // Check if the user is the owner of the podcast
        if (podcast.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete episodes from this podcast' });
        }
        
        // Find the episode index
        const episodeIndex = podcast.episodes.findIndex(ep => ep._id.toString() === req.params.episodeId);
        if (episodeIndex === -1) {
            return res.status(404).json({ message: 'Episode not found' });
        }
        
        // Remove the episode
        podcast.episodes.splice(episodeIndex, 1);
        await podcast.save();
        
        res.json({ message: 'Episode deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router; 