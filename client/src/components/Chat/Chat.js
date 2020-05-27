import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

import { Dialog, DialogTitle } from '@material-ui/core';

import TextContainer from '../TextContainer/TextContainer';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';

import './Chat.css';

let socket;

const Chat = ({ location }) => {
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState('');
  const [decided, setDecided] = useState(false);
  const [result, setResult] = useState(null);
  // const ENDPOINT = 'https://project-chat-application.herokuapp.com/';
  const ENDPOINT = 'localhost:5000/';

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT);

    setRoom(room);

    socket.on('message', (message) => {
      console.log(message);
      if (message.user === name && (message.text === 'draw' || message.text === 'winner' || message.text === 'loser')) {
        setResult(message.text);
      }
    });

    socket.emit('join', { name, room }, (error) => {
      if (error) {
        alert(error);
      }
    });
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.on('roomData', ({ users }) => {
      console.log(users);
      setUsers(users);
    });
  }, []);

  const sendMessage = (input) => () => {
    if (input) {
      socket.emit('sendMessage', input, () => {
        setDecided(true);
      });
    }
  };

  const handleClose = () => {
    setResult(null);
    setDecided(false);
  };

  return (
    <>
      <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={result !== null}>
        <DialogTitle id="simple-dialog-title">{result}</DialogTitle>
      </Dialog>
      <div className="outerContainer">
        <div className="container">
          <InfoBar room={room} users={users || []} />
          {!decided && <Input sendMessage={sendMessage} />}
        </div>
        <TextContainer users={users} />
      </div>
    </>
  );
};

export default Chat;
