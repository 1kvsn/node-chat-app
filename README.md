A Real Time Chat App using Node.js and Socket.io

// upcoming features

 - make chatrooms case-insensitive
 - make usernames unique. Two people with same name will be rejected
 - add a list of currently active chat rooms in the join page with dropdown above join button.

Notes:
- socket.emit() emits an event to a single connection whereas io.emit() emits an event to every single connection.
 - Broadcasting is the term for emitting an event for everybody except one specific user.

 - first arg to socket.emit() is the listener
 - second arg is the data we need to send
 - third arg is a function we need to execute when/after receipt of the data. This function will be executed as a callback in socket.on(). We can also pass data while executing this callback which will be received by the function in the .emit() listener.