const express = require(`express`);
const path = require(`path`);
const http = require(`http`);
const socket_io = require(`socket.io`);
const app = express();
const server = http.createServer(app);
const io = socket_io(server);
const {format} = require(`./utils/messages`);
const {userJoin, getCurrentUser, getRoomUsers,userLeave} = require(`./utils/users`);

app.use(express.static(path.join(__dirname,`public`))); //static folder set

const botName = `studyMate`;

io.on(`connection`, socket => {
    socket.on(`joinRoom`, ({username, room}) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);
        socket.emit(`message`, format(botName, `Welcome.`));    //emits to single client that's connecting.
        socket.broadcast.to(user.room).emit(`message`, format(botName, `${user.username} has joined the chat.`));  //broadcasts to everyone except the client itself.
        io.to(user.room).emit(`roomUsers`, {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    //runs when client disconnects.
    socket.on(`disconnect`, () => { // for the user who leaves the chat.
        const user = userLeave(socket.id);
        if(user){
         io.to(user.room).emit(`message`, format(botName, `${user.username} has left the chat`));
         io.to(user.room).emit(`roomUsers`, {
             room: user.room,
             users: getRoomUsers(user.room)
         });
        }
    });
    socket.on(`chatMessage`, (msg) => { //Listens for chat Message
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit(`message`, format(user.username, msg));
    });
});

const PORT = 3000 || process.env.PORT;
server.listen(`${PORT}`, () => console.log(`Server Running on port ${PORT}`));