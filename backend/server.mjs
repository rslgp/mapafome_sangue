// backend/index.js
import express from 'express';
import cors from 'cors';

import GoogleSheetService from './modules/google/GoogleSpreadsheetService.js'

import errorHandler from './modules/middleware/error/errorHandler.js';
import createHttpsServer from './serverhttps.mjs';

const app = express();
const port = 443;

app.use(cors());
// Middleware to handle JSON requests
app.use(express.json());

// Simple route
app.get('/', async (req, res, next) => {
    res.send('Hello from Express!');
});
app.post('/submit', async (req, res, next) => {
    const { username, bloodTypes } = req.body;
    try {
        await GoogleSheetService.updateRow(username, bloodTypes, req.body);
        res.status(200).json({ 'result': 'hi!' });
    } catch (e) {
        next(e);
    }
});

app.get('/mapdata', async (req, res, next) => {
    const { } = req.body;
    const { } = req.query;
    const { } = req.params;
    try {
        const rows = await GoogleSheetService.readRows();
        res.status(200).json({ 'result': rows });
    } catch (e) {
        next(e);
    }
});

app.use(errorHandler);

// Start the server
// app.listen(port, () => {
//     console.log(`Server is running at http://localhost:${port}`);
// });
const httpsServer = createHttpsServer(app);
httpsServer.listen(port, () => {
    console.log('Server is running at https://localhost:5000');
});
