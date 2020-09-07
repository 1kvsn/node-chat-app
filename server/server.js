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

let existingChatRooms = [];


// io listeners used only for connection
io.on('connection', (socket) => {
	console.log('New user connected');



	socket.on('join', (params, callback) => {
		const room = params.room.toLowerCase();

		if (!isRealString(params.name) || !isRealString(room)) {
			return callback('Name and room name are required.');
		}

		// check if the user with same name is already present
		let existingUsersList = users.getUserList(room); 
		if (existingUsersList.includes(params.name)) {
			return callback('Name is taken. Please choose another name.')
		}

		// user joins a room
		socket.join(room);
		// remove the user from previous rooms if existed
		users.removeUser(socket.id);
		// add user to the new room
		users.addUser(socket.id, params.name, room);

		existingChatRooms = users.getRooms();

		// let everyone in the room know
		io.to(room).emit('updateUserList', users.getUserList(room));

		socket.emit('newMessage', generateMessage('Admin', 'Welcome to Secure Chat.'));

	socket.broadcast.to(room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));

		callback();
	});

	

	// received data becomes input to the callback function
	socket.on('createMessage', (message, callback) => {
		let user = users.getUser(socket.id);

		if (user && message.text === '--help') {
			return console.log('execute help')
		}

		if (user && isRealString(message.text)) {
			io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
		}

		callback();
	});

	socket.on('createLocationMessage', (coords) => {
		let user = users.getUser(socket.id);

		if (user) {
			io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude,coords.longitude));
			
		}
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