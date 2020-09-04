const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const users = new Users();


// serve public folder using express.static middleware
app.use(express.static(publicPath));

// io listeners used only for connection
io.on('connection', (socket) => {
	console.log('New user connected');


	socket.on('join', (params, callback) => {
		if (!isRealString(params.name) || !isRealString(params.room)) {
			return callback('Name and room name are required.');
		}

		// user joins a room
		socket.join(params.room);
		// remove the user from previous rooms if existed
		users.removeUser(socket.id);
		// add user to the new room
		users.addUser(socket.id, params.name, params.room);

		// let everyone in the room know
		io.to(params.room).emit('updateUserList', users.getUserList(params.room));

		socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

	socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));

		callback();
	});


	// received data becomes input to the callback function
	socket.on('createMessage', (message, callback) => {
		console.log('createMessage', message);

		io.emit('newMessage', generateMessage(message.from, message.text));
		callback();
	});

	socket.on('createLocationMessage', (coords) => {
		io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude,coords.longitude));
	});

	socket.on('disconnect', () => {
		let user = users.removeUser(socket.id);

		if (user) {
			// updates users list
			io.to(user.room).emit('updateUserList', users.getUserList(user.room));
			// sends a shoutout to everyone informing user left the room
			io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
		}
	});
});

server.listen(port, () => {
	console.log(`Server is up on port ${port}`);
});