const mongoose = require('mongoose');

// Podcast schema and model
const podcastSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    audioUrl: { type: String, required: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    episodes: [{
        title: { type: String, required: true },
        description: { type: String },
        audioUrl: { type: String, required: true },
        duration: { type: Number },
        releaseDate: { type: Date, default: Date.now }
    }]
});

const Podcast = mongoose.model('Podcast', podcastSchema);

module.exports = Podcast; 