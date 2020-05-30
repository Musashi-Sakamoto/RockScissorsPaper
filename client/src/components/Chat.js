import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

import { Grid, makeStyles, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, Button, Typography } from '@material-ui/core';

import InfoBar from './InfoBar';
import Input from './Input';

let socket;

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#1A1A1D',
    height: '100vh',
    color: '#FFFFFF'
  },
  title: {
    textAlign: 'center'
  },
  dialog: {
    textAlign: 'center',
    color: '#000000'
  }
}));

const Chat = ({ location }) => {
  const classes = useStyles();
  const [room, setRoom] = useState('');
  const [name, setName] = useState('');
  const [users, setUsers] = useState('');
  const [messages, setMessages] = useState([]);
  const [decided, setDecided] = useState(false);
  const [result, setResult] = useState(null);
  const ENDPOINT = 'https://rock-scissors-paper-634.herokuapp.com/';

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT);

    setRoom(room);
    setName(name);

    socket.on('message', (message) => {
      setMessages(oldArray => [...oldArray, message])
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
    setMessages([])
  };

  const emoji = (text) => {
    switch(text) {
      case 'rock':
        return '✊';
        break;
      case 'scissors':
        return '✌';
        break;
      case 'paper':
        return '✋';
        break;
    }
  }

  return (
    <>
      <Dialog fullWidth onClose={handleClose} aria-labelledby="simple-dialog-title" open={result !== null}>
        <DialogTitle id="simple-dialog-title">
          <Typography variant='h4' className={classes.dialog}>
            {result === 'draw' ? 'Tie game🤔 Try another game' : result === 'loser' ? 'You lost the game😔' : result === 'winner' ? 'You won the game🏆' : null}
          </Typography>
          <Typography variant='body1' className={classes.dialog}>
            You: {messages.filter(m => m.user === name).length > 0 && emoji(messages.filter(m => m.user === name)[0].message)}<br />
          </Typography>
          {messages.length > 0 && messages.filter(m => m.user !== name).map(m => (
            <Typography variant='body1' className={classes.dialog}>
              {m.user}: {emoji(m.message)}
            </Typography>
          ))}
        </DialogTitle>
      </Dialog>
      {users.length <= 1 && (
        <Dialog fullWidth aria-labelledby="simple-dialog-title" open={users.length <= 1}>
          <DialogTitle id="simple-dialog-title">
            <Typography variant='h4' className={classes.dialog}>
              Sorry you are alone. 😔Wait for someone to join this room.
            </Typography>
          </DialogTitle>
        </Dialog>
      )}
      {decided && (
        <Dialog fullWidth aria-labelledby="simple-dialog-title" open={decided && !result}>
          <DialogTitle id="simple-dialog-title">
            <Typography variant='h4' className={classes.dialog}>
              Wait for the others to make their choices✋
            </Typography>
          </DialogTitle>
        </Dialog>
      )}
      <Grid container justify="center" alignItems="center" className={classes.root}>
        <Grid item container xs={8} spacing={5}>
          <Grid item xs={12}>
            <Typography variant='h4' className={classes.title}>
              Rock Scissors Paper
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <InfoBar name={name} room={room} users={users || []} />
          </Grid>
          <Grid item xs={12} sm={8} container alignItems="center">
            <Input sendMessage={sendMessage} />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Chat;
