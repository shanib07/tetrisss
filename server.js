const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files from current directory
app.use(express.static(__dirname));

// Serve index.html at root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🍦 Tetris: Summer Meltdown is melting at http://localhost:${PORT}`);
    console.log('Press Ctrl+C to stop the server');
});