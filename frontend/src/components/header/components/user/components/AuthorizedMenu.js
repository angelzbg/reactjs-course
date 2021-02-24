import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';

import { observer } from 'mobx-react';
import { useStore } from '../../../../../store/store';

import { PersonIcon } from '@primer/octicons-react';

import { toggles } from '../../../constants';

export default observer(({ wrapperRef, toggle, setToggle }) => {
  return (
    <div
      id="user-menu"
      ref={wrapperRef}
      className={`authorized-user-menu-wrapper ${toggle ? 'active' : 'inactive'}`}
      onClick={() => setToggle(!toggle ? toggles.main : toggles.closed)}
    >
      <PersonIcon size="small" />
    </div>
  );
});
