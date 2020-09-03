const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);


// serve public folder using express.static middleware
app.use(express.static(publicPath));

// io listeners used only for connection
io.on('connection', (socket) => {
	console.log('New user connected');

	socket.emit('newMessage', {
		from: 'mike@example.com',
		text: 'Hey, what is going on.',
		createdAt: Date.now(),
	});

	// received data becomes input to the callback function
	socket.on('createMessage', (message) => {
		console.log('createMessage', message);
	})

	socket.on('disconnect', () => {
		console.log('User was disconnected');
	});
});

server.listen(port, () => {
	console.log(`Server is up on port ${port}`);
});