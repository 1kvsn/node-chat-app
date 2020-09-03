var socket = io();

socket.on('connect', function() {
	console.log('connected to server');

	socket.emit('createMessage', {
		from: 'jen@example.com',
		text: 'Hey, this is 1kvsn.'
	})
})

socket.on('disconnect', function() {
	console.log('Disconnected from server');
})

// the listener name 'newMessage' should match the one emitted in the server.
// received data becomes input to the callback function
socket.on('newMessage', function(message) {
	console.log('New message', message);
})