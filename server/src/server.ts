// Import the 'express' module
import express from 'express';

// Create an Express application
const app = express();

// Set the port number for the server
const port = 3000;

// Define a route for the root path ('/')
app.get('/', (req, res) => {
  // Send a response to the client
  res.send('Hello, TypeScript + Node.js + Express!');
});

// Start the server and listen on the specified port
app.listen(port, () => {
  // Log a message when the server is successfully running
  console.log(`Server is running on http://localhost:${port}`);
  console.log('Press Ctrl+C to stop the server');
  console.log('To test the server, open http://localhost:3000 in your browser');
  console.log('To stop the server, press Ctrl+C');
  console.log('To restart the server, press Ctrl+C again');
  console.log("Hello")
});
