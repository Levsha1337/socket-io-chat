const io = require('socket.io');
const uuid = require('uuid').v4;

const Message = require('./message');

const TYPES = {
    ALERT: 0,
    TEXT: 1,
    JOIN: 2,
    LEAVE: 3
};

class ChatServer {
    constructor(httpServer) {
        const options = {
            cors: {
                origin: '*',
            }
        };

        this.clients = {};

        this.ws = io(httpServer, options);
        this.ws.on('connection', this.onConnection.bind(this));
    }

    getClientsList(room) {
        return Object.values(this.clients)
            .filter(c => c.room === room)
            .map(c => c.login);
    }

    onConnection(socket) {
        let joinedRoom = null;
        let clientLogin = null;

        socket.on('login', (login, clientRoom) => {
            clientLogin = login;

            if (login.trim().length === 0) {
                socket.emit('error', 'bad username');
                socket.disconnect(true);

                return;
            }

            const room = clientRoom || uuid();
            socket.join(room);
            joinedRoom = room;

            this.clients[socket.id] = {
                login,
                room
            };

            socket.emit('room', room);
            this.ws.to(room).emit('message',
                new Message(TYPES.JOIN, login)
            );
            this.ws.to(room).emit('list',
                this.getClientsList(room)
            );
        });

        socket.on('message', (message) => {
            if (message.trim().length === 0) return;
            this.ws.to(joinedRoom).emit('message',
                new Message(TYPES.TEXT, message, clientLogin)
            );
        });

        socket.on('disconnect', () => {
            if (joinedRoom === null) return;
            this.ws.to(joinedRoom).emit('message',
                new Message(TYPES.LEAVE, clientLogin)
            );
            
            delete this.clients[socket.id];
            this.ws.to(joinedRoom).emit('list',
                this.getClientsList(joinedRoom)
            );

        });
    }
}

module.exports = ChatServer;
