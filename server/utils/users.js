// This class maintains app state and state update methods.

class Users {
	constructor() {
		this.users = [];
	}

	addUser (id, name, room) {
		let user = { id, name, room };
		this.users.push(user);
		return user;
	}

	removeUser (id) {
		let user = this.getUser(id);

		if (user) {
			this.users = this.users.filter(user => user.id !== id );
		}

		return user;
	}

	getUser (id) {
		return this.users.filter(user => user.id === id)[0];
	}

	getUserList (room) {
		let users = this.users.filter(user => user.room === room);
		let namesArray = users.map(user => user.name);

		return namesArray;
	}

	getRooms () {
		console.log(this.users.map(user => user.room), 'this is all rooms')
		return this.users.map(user => user.room);
	}
}

module.exports = { Users }; 