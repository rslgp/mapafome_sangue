import fs from 'fs';
import https from 'https';

const createHttpsServer = (app) => {
    // Paths to your SSL certificates
    const sslOptions = {
        key: fs.readFileSync('./cert/privkey.pem'), // domain sangue.mapafome.com.br
        cert: fs.readFileSync('./cert/fullchain.pem'),
    };

    // Create an HTTPS server with the provided app and SSL options
    const server = https.createServer(sslOptions, app);

    return server;
};

export default createHttpsServer;
