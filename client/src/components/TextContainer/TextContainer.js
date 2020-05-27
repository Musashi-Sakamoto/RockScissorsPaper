import React from 'react';

import onlineIcon from '../../icons/onlineIcon.png';
import offlineIcon from '../../icons/offline.png';

import './TextContainer.css';

const TextContainer = ({ users, name: userName }) => (
  <div className="textContainer">
    <div>
      <h1>Rock Scissors Paper <span role="img" aria-label="emoji">💬</span></h1>
      <h2>Created with React, Express, Node and Socket.IO <span role="img" aria-label="emoji">❤️</span></h2>
    </div>
    {
      users
        ? (
          <div>
            <h1>Who made a choice?</h1>
            <div className="activeContainer">
              <h2>
                {users.map(({ name, isDecided }) => (
                  <div key={name} className="activeItem">
                    {name === userName ? `${name}(You)` : name}
                    <img className="offlineIcon" src={isDecided ? onlineIcon : offlineIcon} alt="offline icon" />
                  </div>
                ))}
              </h2>
            </div>
          </div>
        )
        : null
    }
  </div>
);

export default TextContainer;
