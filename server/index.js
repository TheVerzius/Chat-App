const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require("socket.io");
app.use(cors());
const server = http.createServer(app);

// Dummy user list

const userList = [
	{
		id: "1",
		un: "u1",
		pw: "1",
		email: "one@gmail.com",
		friendList: [1, 3, 4, 5, 6, 7, 8, 9, 10]
	},
	{
		id: "2",
		un: "u2",
		pw: "2",
		email: "two@gmail.com",
		friendList: [1, 4, 5]
	},
	{
		id: "3",
		un: "u3",
		pw: "3",
		email: "three@gmail.com",
		friendList: [1, 2, 4, 5]
	},
	{
		id: "4",
		un: "u4",
		pw: "4",
		email: "four@gmail.com",
		friendList: [3, 2]
	},
	{
		id: "5",
		un: "u5",
		pw: "5",
		email: "five@gmail.com",
		friendList: [3, 4]
	},
];

// Create server

const io = new Server(server, {
	cors: {
		// accept connection from url below
		origin: "http://localhost:3000",
		methods: ["GET", "POST"]
	}
});

// Find user in userList

function findUser({ username, password }) {
	for (let i = 0; i < userList.length; i++)
	{
		if (userList[i].un === username &&
			userList[i].pw === password)
		{
			return userList[i].id;
		}
	}
	return "-1";
}

// Add user to userList

function addUser({ username, password, email }) {
	let id = userList.length + 1;
	userList.push({
		id: id.toString(),
		un: username,
		pw: password,
		email: email,
		friendList: []
	})

	console.log("User List:", userList);
}

// Connection event if someone connect to server

io.on("connection", socket => {
	console.log('User connected: ', socket.id);

	// LOGIN event

	socket.on("LOGIN", data => {
		let id = findUser(data);
		socket.emit('RES_LOGIN', id);
	});

	// SIGN_UP event

	socket.on("SIGN_UP", data => {
		addUser(data);
		let status = true;
		socket.emit('RES_SIGN_UP', status);
	});

	// GET_INFO event

	socket.on("GET_INFO", id => {
		let user = userList.filter(item => item.id === id)[0];
		if (user)
		{
			socket.emit("RES_GET_INFO", {
				username: user.un,
				email: user.email,
				friendList: user.friendList
			});
		}
	})

	// GET_INFO_BY_NAME event

	socket.on("GET_INFO_BY_NAME", name => {
		let user = userList.filter(item => item.un === name)[0];
		if (user)
		{
			socket.emit("RES_GET_INFO_BY_NAME", {
				id: user.id,
				username: user.un,
				email: user.email,
				friendList: user.friendList
			});
		}
	})

	// GET_FRIEND_LIST

	socket.on("GET_FRIEND_LIST", data => {

	});

	// ADD_FRIEND event

	socket.on("ADD_FRIEND", data => {
		let status = true;
		socket.emit('RES_ADD_FRIEND', status);
	});

	// UNFRIEND event

	socket.on("UNFRIEND", data => {
		let status = true;
		socket.emit('RES_UNFRIEND', status);
	});

	// join_room event

	socket.on('join_room', (data) => {
		console.log("Join the room: ", socket.id);
	});

	// disconnect event

	socket.on("disconnect", () => {
		console.log("User disconnected: ", socket.id);
	});

});


// server listen port

server.listen(3001, () => {
	console.log("====================== Server is running ======================");
});