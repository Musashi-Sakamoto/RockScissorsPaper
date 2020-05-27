const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');
const _ = require('lodash');

const { addUser, removeUser, getUser, getUsersInRoom, updateUser } = require('./users');
const { addMessage, removeMessage, getMessagesInRoom } = require('./messages');

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(router);

io.on('connect', (socket) => {
  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if(error) return callback(error);

    socket.join(user.room);

    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);
    const users = getUsersInRoom(user.room);
    updateUser(socket.id);
    io.to(user.room).emit('roomData', { room: user.room, users });
    addMessage({ username: user.name, roomId: user.room, message });

    if (getMessagesInRoom(user.room).length === users.length) {
      users.forEach(user => {
        console.log('user: ', user)
        delete user.isDecided
      })
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

      const messages = getMessagesInRoom(user.room);
      removeMessage()
      const messagesResult = _(messages)
        .map(e => e.message)
        .uniq()
        .sort()
        .value()
      console.log(messagesResult)
      const isEven = messagesResult.length === 2 ? false : true;
      let winner = null;
      if (!isEven) {
        if (!messagesResult.some(e => e === 'rock')) {
          winner = 'scissors';
        } else if(!messagesResult.some(e => e === 'scissors')) {
          winner = 'paper';
        } else {
          winner = 'rock';
        }
      }
      
      messages.forEach(message => {
        console.log(winner);
        io.to(message.roomId).emit('message', { user: message.username, text: isEven ? 'draw' : winner === message.message ? 'winner' : 'loser' });
      });
    }

    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if(user) {
      io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
    }
  })
});

server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));