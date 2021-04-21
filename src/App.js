import React, { Component } from 'react';
import './global.scss';

import Chat from './comp/Chat';
import clientConfig from './config.json';

class App extends Component {
    constructor(props) {
        super(props);

        const config = {
            server: clientConfig.server,
            port: clientConfig.port
        };

        const query = new URLSearchParams(document.location.search);

        const room = query.get('room');
        const login = query.get('login');

        if (room !== null) config.room = room;
        if (login !== null) config.login = login;

        this.config = config;
    }

    render() {
        return (
            <Chat {...this.config} />
        );
    }
}

export default App;
