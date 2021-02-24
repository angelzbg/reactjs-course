import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';

import { observer } from 'mobx-react';

import { PersonIcon, NorthStarIcon, SignInIcon, GlobeIcon } from '@primer/octicons-react';

import Themes from './Themes';

export default observer(({ wrapperRef, toggle, setToggle, closeToggle }) => {
  return (
    <div id="user-menu" ref={wrapperRef} className={`unauthorized-user-menu-wrapper ${toggle ? 'active' : 'inactive'}`}>
      <div className="profile-icon" onClick={() => (!toggle ? setToggle('main') : closeToggle())}>
        <PersonIcon />
      </div>
      {toggle === 'main' && (
        <div className="user-menu-pop">
          <div className="user-menu-item" onClick={() => setToggle('themes')}>
            <div className="user-menu-icon">
              <NorthStarIcon />
            </div>{' '}
            <div className="user-menu-title">Change theme</div>
          </div>
          <div className="user-menu-separator" />
          <Link to="/login" className="user-menu-item">
            <div className="user-menu-icon">
              <SignInIcon />
            </div>{' '}
            <div className="user-menu-title">Sign in</div>
          </Link>
          <Link to="/register" className="user-menu-item">
            <div className="user-menu-icon">
              <GlobeIcon />
            </div>{' '}
            <div className="user-menu-title">Sign up</div>
          </Link>
        </div>
      )}
      {toggle === 'themes' && <Themes {...{ setToggle }} />}
    </div>
  );
});
