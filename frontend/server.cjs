// Change from import to require
const jsonServer = require('json-server');
const cors = require('cors');
const fs = require('fs');

// Initialize your server
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Middleware setup
server.use(cors());
server.use(jsonServer.bodyParser);

// Custom routes if needed
server.post('/login', (req, res) => {
  // Your login logic
  res.status(200).json({ message: 'Logged in successfully' });
});

// Add other custom routes as needed

// Set default middlewares
server.use(middlewares);

// Use the router
server.use(router);

// Start the server
server.listen(5000, () => {
  console.log('JSON Server is running on http://localhost:5000');
});
