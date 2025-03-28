const express = require('express');
const path = require('path');

const app = express();

// Serve static assets from the root directory (including 'public')
app.use(express.static(path.join(__dirname, 'public')));

// Allow serving files from node_modules (for Three.js & web-ifc-three)
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

// Handle 404 errors
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
