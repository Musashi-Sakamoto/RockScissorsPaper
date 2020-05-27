import React, { Fragment } from 'react';

import onlineIcon from '../../icons/onlineIcon.png';
import offlineIcon from '../../icons/offline.png';
import closeIcon from '../../icons/closeIcon.png';

import './InfoBar.css';

const InfoBar = ({ room, users }) => (
  <div className="infoBar">
    <div className="leftInnerContainer">
      <img className="onlineIcon" src={onlineIcon} alt="online icon" />
      <h3>{room}</h3>
    </div>
    <div className="rightInnerContainer">
      {users.map((user) => (
        <Fragment key={user.name}>
          <img className="offlineIcon" src={user.isDecided ? onlineIcon : offlineIcon} alt="offline icon" />
          <h3 className="username">{user.name}</h3>
        </Fragment>
      ))}
      <a href="/"><img src={closeIcon} alt="close icon" /></a>
    </div>
  </div>
);

export default InfoBar;
