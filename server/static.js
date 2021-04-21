const express = require('express');

function getApp() {
    const app = express();

    const build = express.static('./build', {
        index: 'index.html'
    });
    
    app.use('/', build);

    return app;
}

module.exports = {
    getApp
};
