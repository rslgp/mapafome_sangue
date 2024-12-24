import fs from 'fs';
import path from 'path';
import https from 'https';

const createHttpsServer = (app) => {
    // Construct absolute paths to the SSL certificate files
    const keyPath = path.resolve('backend/cert', 'privkey.pem'); // Adjust the path if needed
    const certPath = path.resolve('backend/cert', 'fullchain.pem');

    // Check if the certificate files exist
    if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
        console.error('Error: SSL certificate files not found.');
        console.error(`Missing file(s): ${!fs.existsSync(keyPath) ? keyPath : ''} ${!fs.existsSync(certPath) ? certPath : ''}`);
        process.exit(1); // Exit the process with a non-zero code
    }

    // Load the certificate files
    const sslOptions = {
        key: fs.readFileSync(keyPath, 'utf-8'),
        cert: fs.readFileSync(certPath, 'utf-8'),
    };

    // Create an HTTPS server
    const server = https.createServer(sslOptions, app);

    return server;
};

export default createHttpsServer;
