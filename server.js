const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Load configuration
const CONFIG_PATH = path.join(__dirname, 'config.json');
let config = {};

try {
    const configData = fs.readFileSync(CONFIG_PATH, 'utf8');
    config = JSON.parse(configData);
} catch (error) {
    config = {
        title: 'Infinite Media',
        heading: 'Random Media Gallery',
        favicon: 'favicon.ico',
        background: '',
        mediaFolder: 'media',
        initialCount: 10,
        loadMoreCount: 30
    };
}

const MEDIA_FOLDER = path.join(__dirname, config.mediaFolder || 'media');
const PUBLIC_FOLDER = path.join(__dirname, 'public');

// Block directory listing but allow root path
app.use((req, res, next) => {
    if (req.path !== '/' && req.path.endsWith('/')) {
        return res.status(404).send('Not found');
    }
    next();
});

// Serve media files (no directory index)
app.use('/media', express.static(MEDIA_FOLDER, {
    dotfiles: 'deny',
    index: false
}));

// Serve config to frontend
app.get('/api/config', (req, res) => {
    res.json({
        title: config.title,
        heading: config.heading,
        favicon: config.favicon,
        background: config.background,
        initialCount: config.initialCount || 10,
        loadMoreCount: config.loadMoreCount || 30
    });
});

// API Endpoint: Returns random media files
app.get('/api/random-media', (req, res) => {
    const count = parseInt(req.query.count) || (config.initialCount || 10);

    try {
        if (!fs.existsSync(MEDIA_FOLDER)) {
            return res.status(404).json({ error: 'Media folder not found' });
        }

        const files = fs.readdirSync(MEDIA_FOLDER);

        const mediaFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.webm', '.mov'].includes(ext);
        });

        if (mediaFiles.length === 0) {
            return res.status(404).json({ error: 'No media files found in folder' });
        }

        const shuffled = [...mediaFiles].sort(() => 0.5 - Math.random());
        const randomFiles = shuffled.slice(0, Math.min(count, mediaFiles.length));

        const response = randomFiles.map(file => {
            const ext = path.extname(file).toLowerCase();
            const isVideo = ['.mp4', '.webm', '.mov'].includes(ext);
            return {
                id: file,
                type: isVideo ? 'video' : 'image',
                url: `/media/${file}`,
                alt: file
            };
        });

        res.json(response);

    } catch (error) {
        res.status(500).json({ error: 'Failed to read media folder' });
    }
});

// Serve static files from public folder
app.use(express.static(PUBLIC_FOLDER));

// 404 handler - LAST
app.use((req, res) => {
    res.status(404).send('Not found');
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});