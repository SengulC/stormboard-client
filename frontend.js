// https://youtu.be/5_7uz6bErpY?list=TLPQMjUwMzIwMjQes4OVzqzc6w
import express from "express";
import path from 'path';
const app = express();
const __dirname = path.dirname("");

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle any other routes that may come from react-router
app.get('/*', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
});

// Start the server
const PORT = process.env.PORT || 5173;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})