import React from 'react';
import Carousel from 'react-material-ui-carousel';
import { Card, Container, ButtonBase } from '@material-ui/core';

import Rock from '../../icons/rock.png';
import Scissors from '../../icons/scissors.png';
import JapanesePaper from '../../icons/paper.png';

import './Input.css';

const Input = ({ sendMessage }) => {
  const items = [
    {
      name: 'rock',
      image: Rock,
    },
    {
      name: 'scissors',
      image: Scissors,
    },
    {
      name: 'paper',
      image: JapanesePaper,
    },
  ];
  return (
    <Container className="container">
      <Carousel fullHeightHover navButtonsAlwaysVisible autoPlay={false} animation="slide">
        {items.map((item, i) => (
          <ButtonBase key={i} className="buttonBase">
            <Card onClick={sendMessage(item.name)} elevation={3} className="paper">
              <img src={item.image} className="image" />
            </Card>
          </ButtonBase>
        ))}
      </Carousel>
    </Container>
  );
};

export default Input;
