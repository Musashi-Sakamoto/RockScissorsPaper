import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

import { Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, Button } from '@material-ui/core';

import TextContainer from '../TextContainer/TextContainer';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';

import './Chat.css';

let socket;

const Chat = ({ location }) => {
  const [room, setRoom] = useState('');
  const [name, setName] = useState('');
  const [users, setUsers] = useState('');
  const [decided, setDecided] = useState(false);
  const [result, setResult] = useState(null);
  const ENDPOINT = 'https://rock-scissors-paper-634.herokuapp.com/';

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT);

    setRoom(room);
    setName(name);

    socket.on('message', (message) => {
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
      <Dialog fullWidth onClose={handleClose} aria-labelledby="simple-dialog-title" open={result !== null}>
        <DialogTitle id="simple-dialog-title">
          <h1 className="textAlignCenter">
            {result === 'draw' ? 'Tie game!!' : result === 'loser' ? 'You lost the game!' : result === 'winner' ? 'You won the game.' : null}
          </h1>
        </DialogTitle>
      </Dialog>
      <div className="outerContainer">
        <div className="container">
          <InfoBar name={name} room={room} users={users || []} />
          {users.length <= 1 && (
            <Dialog fullWidth aria-labelledby="simple-dialog-title" open={users.length <= 1}>
              <DialogTitle id="simple-dialog-title">
                <h1 className="textAlignCenter">
                  Sorry you are alone. Wait for someone to join this room.
                </h1>
              </DialogTitle>
            </Dialog>
          )}
          {decided ? (
            <Dialog fullWidth aria-labelledby="simple-dialog-title" open={decided && !result}>
              <DialogTitle id="simple-dialog-title">
                <h1 className="textAlignCenter">
                  Wait for the others to make their choices.
                </h1>
              </DialogTitle>
            </Dialog>
          ) : <Input sendMessage={sendMessage} />}
        </div>
        <TextContainer users={users} name={name} />
      </div>
    </>
  );
};

export default Chat;
