// backend/index.js
import express from 'express';
import cors from 'cors';

import GoogleSheetService from './modules/google/GoogleSpreadsheetService.js'

import errorHandler from './modules/middleware/error/errorHandler.js';

const app = express();
const port = 5000;

app.use(cors());
// Middleware to handle JSON requests
app.use(express.json());

// Simple route
app.get('/', (req, res) => {
    res.send('Hello from Express!');
});
app.post('/submit', async (req, res, next) => {
    const { username, bloodTypes } = req.body;
    try {
        await GoogleSheetService.updateRow(username, bloodTypes, req.body);
        res.status(200).json({ 'result': 'hi!' });
    } catch (e) {
        console.log("AQUI NO ERRO")
        next(e);
    }
});

app.use(errorHandler);

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
