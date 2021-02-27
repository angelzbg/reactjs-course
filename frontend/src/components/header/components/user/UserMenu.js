import './styles/user.css';

import React, { useState, useEffect, useRef } from 'react';
import { Link, withRouter } from 'react-router-dom';

import { observer } from 'mobx-react';
import { useStore } from '../../../../store/store';

import AuthorizedMenu from './components/AuthorizedMenu';
import UnauthorizedMenu from './components/UnauthorizedMenu';

import { toggles } from '../../constants';

export default observer(() => {
  const store = useStore();

  const [toggle, setToggle] = useState(toggles.closed);

  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!wrapperRef?.current?.contains(e.target) && e.target.id !== 'user-menu') {
        setToggle(toggles.closed);
      }
    };

    document.addEventListener('mousedown', handleClickOutside, { capture: true });

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, { capture: true });
    };
  }, []);

  return store.user ? (
    <AuthorizedMenu {...{ wrapperRef, toggle, setToggle }} />
  ) : (
    <UnauthorizedMenu {...{ wrapperRef, toggle, setToggle }} />
  );
});
