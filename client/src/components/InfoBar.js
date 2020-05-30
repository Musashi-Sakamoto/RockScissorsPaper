import React, { Fragment } from 'react';

import onlineIcon from '../icons/onlineIcon.png';
import offlineIcon from '../icons/offline.png';
import closeIcon from '../icons/closeIcon.png';

import { Card, Grid, ButtonBase, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    color: '#FFFFFF'
  },
  roomName: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  }
}));

const InfoBar = ({ room, users, name }) => {
  const classes = useStyles();

  return (
    <Grid container direction="column" className={classes.root} spacing={2}>
      <Grid item>
        <Typography variant="h6">Rooms</Typography>
      </Grid>
      <Grid item>
        <img className="onlineIcon" src={onlineIcon} alt="online icon" />
        <Typography component='span' className={classes.roomName}>{room}</Typography>
      </Grid>
      <Grid item>
        <Typography variant="h6">Users</Typography>
      </Grid>
      <Grid item container>
        {users.map((user) => (
          <Grid item key={user.name}>
            <img className="offlineIcon" src={user.isDecided ? onlineIcon : offlineIcon} alt="offline icon" />
            <Typography component='span' className={classes.roomName}>{user.name === name ? `${user.name}(You)` : user.name}</Typography>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}

export default InfoBar;
