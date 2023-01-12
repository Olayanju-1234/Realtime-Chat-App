const express = require('express');
const path = require('path');
const http = require('http')
const socketio = require('socket.io');
const formatMessage = require('./utils/messages')
const { userJoin, getCurrentUser } = require('./utils/users')
const adminName = "Admin"
const app = express();


// Create server
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Run when client connects
io.on('connection', socket => {
    socket.on('joinRoom', ({username, room}) => {
        const user = userJoin(socket.id,username, room)
        
        socket.join(user.room)
        
           // Welcome current user
    socket.emit('message', formatMessage(adminName, 'Welcome to ChatCord!'));

    // Broadcast when user connects
    socket.broadcast.
    to(user.room)
    .emit('message', formatMessage(adminName, `${user.username} has joined the chat`));
    })


    // Listen for chat message
    socket.on('chatMessage', (msg => {
        io.emit('message', formatMessage("USER", msg))
    }))

    
    // Runs when client disconnects
    socket.on('disconnect', () => {
        io.emit('message', formatMessage(adminName, 'A user has left the chat'));
    });

});


const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

