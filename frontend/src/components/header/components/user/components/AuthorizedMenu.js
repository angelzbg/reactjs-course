import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';

import { observer } from 'mobx-react';
import { useStore } from '../../../../../store/store';

import { PersonIcon } from '@primer/octicons-react';

export default observer(({ wrapperRef, toggle, setToggle, closeToggle }) => {
  return (
    <div
      id="user-menu"
      ref={wrapperRef}
      className={`authorized-user-menu-wrapper ${toggle ? 'active' : 'inactive'}`}
      onClick={() => (!toggle ? setToggle('main') : closeToggle())}
    >
      <PersonIcon size="small" />
    </div>
  );
});
