const app = require('./server/static.js').getApp();
const httpServer = require('http').createServer(app);

const WSChatServer = require('./server/chat-server.js');
const config = require('./config.json');

new WSChatServer(httpServer);

httpServer.listen(config.port, config.address, () => {
    console.log(`WS chat served on ${config.address}:${config.port}`);
    console.log(`You can open it here: http://localhost:${config.port}`);
});
