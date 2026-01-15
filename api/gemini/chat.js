const { createServer } = require('http');
const express = require('express');
const app = express();
// Import the existing server setup (routes, middleware)
require('../apps/Fitness/src/server'); // Adjust path if needed; this registers the /api/gemini/chat route on the app
module.exports = createServer(app);
