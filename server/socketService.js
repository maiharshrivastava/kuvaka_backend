const { joinRoom, sendMessage, userDisconnected } = require('./controllers/Chat');

const handleUsers = (io, socket) => {
    socket.on('joinRoom', (data) => {
        joinRoom(socket, data);
    });

    socket.on('sendMessage', (data) => {
        sendMessage(socket, data);
    });

    socket.on('disconnect', () => {
        userDisconnected(socket);
    });
};

module.exports = { handleUsers };
