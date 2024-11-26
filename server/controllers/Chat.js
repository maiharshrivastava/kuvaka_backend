const Chat = require('../models/Chat');

let users = {}; 

const joinRoom = (socket, { username, room }) => {
    if (!users[room]) {
        users[room] = [];
    }
    const newUser = { id: socket.id, username };
    users[room].push(newUser);
    socket.join(room);

    console.log(`${username} joined room: ${room}`);

    socket.emit('userList', users[room]);

    socket.to(room).emit('message', { user: 'System', text: `${username} has joined the room.` });
};

const sendMessage = async (socket, { user, text, room }) => {
    const chat = new Chat({ username: user, message: text, room });
    await chat.save(); 
    const messageData = { username: user, message: text };
    socket.to(room).emit('message', messageData); 
    socket.emit('message', messageData); 
};

const getAllChats = async (req, res) => {
    const { room } = req.params;

    try {
        const chats = await Chat.find({ room }).sort({ timestamp: 1 });
        res.json(chats);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch chats', details: err.message });
    }
};

const userDisconnected = (socket) => {
    console.log(`User disconnected: ${socket.id}`);
    for (const room in users) {
        users[room] = users[room].filter((user) => user.id !== socket.id);
        socket.to(room).emit('userList', users[room]);
    }
};

module.exports = {
    joinRoom,
    sendMessage,
    userDisconnected, 
    getAllChats,
};
