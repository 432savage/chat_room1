const chatForm = document.getElementById(`chat-form`);
const roomName = document.getElementById(`room-name`);
const userList = document.getElementById(`users`);
const chatMessages = document.querySelector(`.chat-messages`);
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

socket.emit(`joinRoom`, {username, room});
socket.on(`message`, message => { //Incoming message listener from the server
    outputMessage(message);
    //Scroll it down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on(`roomUsers`, ({room, users}) => {
    outputRoomName(room);
    outputUsers(users);
});

chatForm.addEventListener(`submit`,(e) => {
    e.preventDefault();
    const msg = e.target.elements.msg.value; //get the message
    socket.emit(`chatMessage`, msg); // emit it to the server.
    e.target.elements.msg.value = ``;
    e.target.elements.msg.focus();
});

outputMessage = (message) => {
    const div = document.createElement(`div`);
    div.classList.add(`message`);
    div.innerHTML = `<p class="meta">${message.userName} <span>${message.time}</span></p>
        <p class="text">${message.text}</p>`;
    document.querySelector(`.chat-messages`).appendChild(div);
};

outputRoomName = (room) => {
    roomName.innerHTML = room;
};

outputUsers = (users) => {
     userList.innerHTML = `${users.map( user  => `<li>${user.username}</li>`).join(``)}`
};