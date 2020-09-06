A Real Time Chat App using Node.js and Socket.io

* Features:
- Create your own chat room. Room name is case-insensitive.
- Upon entering your chatroom, Admin greets you and notifies everyone in the room of your arrival.
- It shows the names of all the people currently present in the room.
- You can send your location using Send Location button. If your browser supports it, it will ask for your permission before your location is sent. Otherwise, an error is shown.
- When a user leaves the room, everyone gets notified in the room.

// upcoming
 - add a list of currently active chat rooms in the join page with dropdown above join button.
 - show the room name within a room
 - leave room button
 - add incoming message sound
 - allow making a secret room ( should not showup in room dropdown)

Notes:
- socket.emit() emits an event to a single connection whereas io.emit() emits an event to every single connection.
 - Broadcasting is the term for emitting an event for everybody except one specific user.

 - first arg to socket.emit() is the listener
 - second arg is the data we need to send
 - third arg is a function we need to execute when/after receipt of the data. This function will be executed as a callback in socket.on(). We can also pass data while executing this callback which will be received by the function in the .emit() listener.