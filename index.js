const fs = require('node:fs');
const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to allow CORS
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader("Access-Control-Allow-Headers", "*");
    next();
});

// Middleware to parse text/csv bodies
app.use(express.text())

// Simple GET route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/outlook.csv', (req, res) => {
    fs.readFile('outlook.csv', 'utf8', (err, data) => {
        if (err) {
            console.error("readFile produced this error:");
            console.error(err);
            return;
        }
        console.log("readFile read this content:");
        console.log(data);
        res.send(data);
    });
});

app.get('/outlook.json', (req, res) => {
    fs.readFile('outlook.json', 'utf8', (err, data) => {
        if (err) {
            console.error("readFile produced this error:");
            console.error(err);
            return;
        }
        console.log("readFile read this content:");
        console.log(data);
        res.send(data);
    });
});

// Example GET route for a resource
app.get('/api/items', (req, res) => {
    res.json([{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }]);
});

// Example POST route to create a new resource
app.post('/upload_csv', (req, res) => {
    const newItem = req.body;
    console.log("This is the content of the CSV file uploaded:");
    console.log(req.body);
    console.log("End of content");
    // Normally, you'd save this to a database
    res.json([{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }]);
    //res.status(201).json(newItem);
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
