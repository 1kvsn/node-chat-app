var socket = io();

function scrollToBottom() {
	// Selectors
	let messages = jQuery('#messages');
	let newMessage = messages.children('li:last-child');

	//Heights
	let clientHeight = messages.prop('clientHeight');
	let scrollTop = messages.prop('scrollTop');
	let scrollHeight = messages.prop('scrollHeight');
	let newMessageHeight = newMessage.innerHeight();
	let lastMessageHeight = newMessage.prev().innerHeight();

	if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
		messages.scrollTop(scrollHeight);
	}
};

socket.on('connect', function() {
	let params = jQuery.deparam(window.location.search);

	socket.emit('join', params, function (err) {
		if (err) {
			alert(err);
			window.location.href = '/';
		} else {
			console.log('No error');
		}
	}); 
})

socket.on('disconnect', function() {
	console.log('Disconnected from server');
})

// upon disconnection, remove the user and update the userList
socket.on('updateUserList', function (users) {
	let ol = jQuery('<ol></ol>');

	users.forEach(function (user) {
		ol.append(jQuery('<li></li>').text(user));
	});

	// .html method wipes the old one and inserts new one.
	// .append method updates the element
	jQuery('#users').html(ol);
});

// the listener name 'newMessage' should match the one emitted in the server.
// received data becomes input to the callback function
socket.on('newMessage', function(message) {
	let formattedTime = moment(message.createdAt).format('h:mm a');

	let template = jQuery('#message-template').html();
	let html = Mustache.render(template, {
		text: message.text,
		from: message.from,
		createdAt: formattedTime,
	});

	jQuery('#messages').append(html);
	scrollToBottom();
})

socket.on('newLocationMessage', function (message) {
	let formattedTime = moment(message.createdAt).format('h:mm a');

	let template = jQuery('#location-message-template').html();
	let html = Mustache.render(template, {
		from: message.from,
		url: message.url,
		createdAt: formattedTime,
	})

	jQuery('#messages').append(html);
	scrollToBottom();
});

// Message Form
jQuery('#message-form').on('submit', function (e) {
	// prevents page refresh on form submit
	e.preventDefault();

	let messageTextbox = jQuery('[name=message]');
 
	socket.emit('createMessage', {
		text: messageTextbox.val()
	}, function () {
		// clears text box upon message send
		messageTextbox.val('');
	});
});

// Location Fetching and Sending
let locationButton = jQuery('#send-location');
locationButton.on('click', function() {
	if (!navigator.geolocation) {
		return alert('Geolocation not supported by your browser.')
	}

	locationButton.attr('disabled', 'disabled').text('Sending location...');

	navigator.geolocation.getCurrentPosition(function (position) {
		locationButton.removeAttr('disabled').text('Send location');

		socket.emit('createLocationMessage', {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude,
		})
	}, function () {
		locationButton.removeAttr('disabled').text('Send location');
		alert('Unable to fetch location');
	});
});