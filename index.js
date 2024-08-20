const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Simple GET route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/myfolder', (req, res) => {
    res.send('Goodbye World!');
});

// Example GET route for a resource
app.get('/api/items', (req, res) => {
    res.json([{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }]);
});

// Example POST route to create a new resource
app.post('/api/items', (req, res) => {
    const newItem = req.body;
    // Normally, you'd save this to a database
    res.status(201).json(newItem);
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
