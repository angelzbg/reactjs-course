import './styles/user.css';

import React, { useState, useEffect, useRef } from 'react';
import { Link, withRouter } from 'react-router-dom';

import { observer } from 'mobx-react';
import { useStore } from '../../../../store/store';

import AuthorizedMenu from './components/AuthorizedMenu';
import UnauthorizedMenu from './components/UnauthorizedMenu';

export default observer(() => {
  const store = useStore();

  const [toggle, setToggle] = useState('');
  const closeToggle = () => setToggle('');

  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef && wrapperRef.current && !wrapperRef.current.contains(e.target) && e.target.id !== 'user-menu') {
        closeToggle();
      }
    };

    document.addEventListener('click', handleClickOutside, { capture: true });

    return () => {
      document.removeEventListener('click', handleClickOutside, { capture: true });
    };
  }, []);

  return store.user ? (
    <AuthorizedMenu {...{ wrapperRef, toggle, setToggle, closeToggle }} />
  ) : (
    <UnauthorizedMenu {...{ wrapperRef, toggle, setToggle, closeToggle }} />
  );
});
