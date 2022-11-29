const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require("socket.io");
app.use(cors());
const server = http.createServer(app);


const userList = [
	{
		id: "1",
		un: "u1",
		pw: "1",
		email: "one@gmail.com",
		friendList: [3, 4, 5]
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

const io = new Server(server, {
	cors: {
		// accept connection from url below
		origin: "http://localhost:3000",
		methods: ["GET", "POST"]
	}
});

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


io.on("connection", socket => {
	console.log('User connected: ', socket.id);

	socket.on("LOGIN", data => {
		let id = findUser(data);
		socket.emit('RES_LOGIN', id);
	});

	socket.on("SIGN_UP", data => {
		addUser(data);
		let status = true;
		socket.emit('RES_SIGN_UP', status);
	});

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
		else
		{
			socket.emit("RES_GET_INFO_BY_NAME", {
				id: "-1",
				username: null
			});
		}
	})

	socket.on("GET_FRIEND_LIST", data => {

	});

	socket.on("ADD_FRIEND", data => {
		let status = true;
		socket.emit('RES_ADD_FRIEND', status);
	});

	socket.on("UNFRIEND", data => {
		let status = true;
		socket.emit('RES_UNFRIEND', status);
	});

	socket.on('join_room', (data) => {
		console.log("Join the room: ", socket.id);
	});

	socket.on("disconnect", () => {
		console.log("User disconnected: ", socket.id);
	});

});


server.listen(3001, () => {
	console.log("====================== Server is running ======================");
});