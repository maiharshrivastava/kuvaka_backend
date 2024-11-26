const express = require('express');
const { getAllChats } = require('../controllers/Chat');

const router = express.Router();

router.get('/chats/:room', getAllChats);

module.exports = router;
