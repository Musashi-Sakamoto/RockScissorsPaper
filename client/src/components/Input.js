import React from 'react';
import { Card, Grid, ButtonBase, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  paper: {
    textAlign: 'center',
    fontSize: '10em',
  },
  container: {
    textAlign: 'center'
  },
}));

const Input = ({ sendMessage }) => {
  const classes = useStyles();
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={4} className={classes.container}>
        <ButtonBase onClick={sendMessage('rock')}>
          <Card elevation={3} className={classes.paper}>
            <Typography variant="h1">
            ✊
            </Typography>
          </Card>
        </ButtonBase>
      </Grid>
      <Grid item xs={12} sm={4} className={classes.container}>
        <ButtonBase onClick={sendMessage('scissors')}>
          <Card elevation={3} className={classes.paper}>
            <Typography variant="h1">
            ✌
            </Typography>
          </Card>
        </ButtonBase>
      </Grid>
      <Grid item xs={12} sm={4} className={classes.container}>
        <ButtonBase onClick={sendMessage('paper')}>
          <Card elevation={3} className={classes.paper}>
            <Typography variant="h1">
            ✋
            </Typography>
          </Card>
        </ButtonBase>
      </Grid>
    </Grid>
  );
};

export default Input;
