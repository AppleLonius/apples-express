const fs = require('node:fs').promises;
const express = require('express');

const app = express();
const port = 3000;

const TEMPLATE = {
    "year": "string",
    "Area (1000 ha)": "number",
    "Yield (t/ha)": "number",
    "Total production": "number",
    "Losses and feed use": "number",
    "Usable production": "number",
    "Production (fresh)": "number",
    "Exports (fresh)": "number",
    "Imports (fresh)": "number",
    "Consumption (fresh)": "number",
    "per capita consumption (kg) - fresh": "number",
    "Ending stocks (fresh)": "number",
    "Change in stocks (fresh)": "number",
    "Self-sufficiency rate (fresh) %": "number",
    "Production (processed)": "number",
    "Exports (processed)": "number",
    "Imports (processed)": "number",
    "Consumption (processed)": "number",
    "per capita consumption (kg) - processed": "number",
    "Self-sufficiency rate (processed) %": "number",
};

function verifyStructure(arr) {
    if (!Array.isArray(arr)) throw "JSON should be an array"
    if (arr.length == 0) throw "JSON array is empty";
    const m = Object.keys(TEMPLATE).length;
    for (const obj of arr) {
        if (Object(obj) !== obj) throw "JSON array should have objects as elements"; 
        for (const [key, value] of Object.entries(obj)) {
            if (!TEMPLATE[key]) throw `Unexpected indicator '${key}' in JSON data`;
            if (TEMPLATE[key] !== typeof value) throw `Expected '${key}' to be a ${TEMPLATE[key]}, but got a ${typeof value}`;
        }
        const n = Object.keys(obj).length;
        if (n !== m) throw `Expected ${m} indicators, got ${n}`;
    }
}

function transpose(matrix) { // Swap rows/columns
    return matrix.length ? matrix[0].map((_, col) => matrix.map(row => row[col]))
                         : matrix;
}

function toCsv(arr) {
    // Convert array of objects to matrix of strings
    const result = [
        Object.keys(TEMPLATE),
        ...arr.map(row => 
            Object.entries(TEMPLATE).map(([key, dtype]) =>
                dtype == "number" ? (+row[key]).toFixed(1) : row[key]
            )
        )
    ];
    // Convert matrix to one CSV string
    return transpose(result).map(row =>
        row.join()
    ).join("\n");
}

function toNumber(text) { // If it looks like a number, cast it to number
    text = text.trim();
    if (/^-?[\d ,.]+$/.test(text)) { // looks like a number?
        return +text.replaceAll(" ", ""); // cast it to number
    }
    return text;
}

function parseCsv(text) { // Convert CSV text to matrix
    console.log("CSV is:");
    console.log(text);
    const lines = text.match(/.+/g) ?? [];
    return lines.map(line => 
        line.split(",").map(toNumber)
    )
}

function toObjects(matrix) { // Matrix with header row, to an array of objects
    const keys = matrix.shift();
    return matrix.map(values =>
        Object.fromEntries(keys.map((key, i) => [key, values[i]]))
    )
}

function convertFromCsv(text) {
    // Interpret as CSV and transpose the resulting matrix
    const matrix = transpose(parseCsv(text));
    // Boundary case
    if (matrix.length == 0 || matrix[0].length == 0) return matrix;
    // Set the (probably blank) top-left cell
    matrix[0][0] = "year";
    // Turn the data into the final format
    return toObjects(matrix);
}

async function persist(data) {
    // Write the data both as JSON and CSV files
    await fs.writeFile('outlook.csv', toCsv(data));
    await fs.writeFile("outlook.json", JSON.stringify(data, null, 2));
    return data.length;
}

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.text());
  
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
    try {
        const data = fs.readFile('outlook.csv');
        res.send(data);
    } catch (err) {
        console.error("readFile produced this error:");
        console.error(err);
        res.send(err);
    }
});

app.get('/outlook.json', async (req, res) => {
    try {
        const data = await fs.readFile('outlook.json');
        res.send(data);
    } catch (err) {
        console.error("readFile produced this error:");
        console.error(err);
        res.send(err);
    }
});

<<<<<<< HEAD
app.post('/upload_csv', async (req, res) => {
    console.log("This is the content of the POST request with upload_csv:")
    console.log(req.body);
    try {
        const count = await persist(convertFromCsv(req.body));
        res.json({ 
            "success": "OK", 
            "message": `Uploaded data covers ${count} years`,
        });
    } catch (err) {
        console.log("Got an error with writing to file:");
        console.log(err);
        res.json({
            "success": "NOK",
            "message": err?.message ?? err,
        });
    }
});

app.post('/upload_json', async (req, res) => {
    console.log("This is the content of the POST request with upload_json:")
    console.log(req.body);
    try {
        const count = await persist(req.body);
        res.json({ 
            "success": "OK", 
            "message": `Uploaded data covers ${count} years`,
        });
    } catch (err) {
        console.log("Got an error with writing to file:");
        console.log(err);
        res.json({
            "success": "NOK",
            "message": err?.message ?? err,
        });
    }
=======
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
>>>>>>> 8f3362107afc23889c9c62346937050a953a85b9
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
