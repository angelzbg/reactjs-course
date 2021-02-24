import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';

import { observer } from 'mobx-react';
import { useStore } from '../../../../../store/store';

import { PersonIcon, NorthStarIcon } from '@primer/octicons-react';

import Themes from './Themes';

import { toggles } from '../../../constants';

export default observer(({ wrapperRef, toggle, setToggle }) => {
  return (
    <div id="user-menu" ref={wrapperRef} className={`user-menu-wrapper ${toggle ? 'active' : 'inactive'}`}>
      <div className="profile-icon" onClick={() => setToggle(!toggle ? toggles.main : toggles.closed)}>
        <PersonIcon />
      </div>
      {toggle === toggles.main && (
        <div className="user-menu-pop">
          <div className="user-menu-item" onClick={() => setToggle(toggles.themes)}>
            <div className="user-menu-icon">
              <NorthStarIcon />
            </div>{' '}
            <div className="user-menu-title">Change theme</div>
          </div>
          <div className="user-menu-separator" />
        </div>
      )}
      {toggle === toggles.themes && <Themes {...{ setToggle }} />}
    </div>
  );
});
