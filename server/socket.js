const { Server } = require('socket.io');
const { handleUsers } = require('./socketService');

let io;

const socketSetup = (server) => {
    io = new Server(server, {
        cors: {
            origin: '*', 
            methods: ['GET', 'POST'],
        },
    });

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        handleUsers(io, socket);
    });
};

module.exports = { socketSetup };
