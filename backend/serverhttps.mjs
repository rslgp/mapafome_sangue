import fs from 'fs';
import https from 'https';

const createHttpsServer = (app) => {
    // Paths to your SSL certificates
    const sslOptions = {
        key: fs.readFileSync('/etc/letsencrypt/live/sangue.mapafome.com.br/privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/sangue.mapafome.com.br/fullchain.pem'),
    };

    // Create an HTTPS server with the provided app and SSL options
    const server = https.createServer(sslOptions, app);

    return server;
};

export default createHttpsServer;
