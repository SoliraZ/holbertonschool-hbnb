const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();

// Serve static files from the hbnb_frontend directory
app.use(express.static(path.join(__dirname, 'part4/hbnb_frontend')));

// Proxy API requests to the Flask backend
app.use('/api', createProxyMiddleware({
    target: 'http://127.0.0.1:5000',
    changeOrigin: true,
    followRedirects: false, // Prevent redirects
    pathRewrite: {
        '^/api': '/api' // No path rewriting needed
    },
    onProxyRes: function (proxyRes, req, res) {
        // Add CORS headers to the response
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
        proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
        proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
    }
}));

// Handle OPTIONS requests
app.options('/api/*', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
    console.log(`Serving frontend from ${path.join(__dirname, 'part4/hbnb_frontend')}`);
    console.log(`Proxying API requests to http://127.0.0.1:5000`);
}); 