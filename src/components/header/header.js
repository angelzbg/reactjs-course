import './styles/header.css';

import globe from '../../images/globe.png';

import React from 'react';
import { Link, withRouter } from 'react-router-dom';

import { observer } from 'mobx-react';
import { useStore } from '../../store/store';

export default observer(
  withRouter(({ location: { pathname } }) => {
    const store = useStore();
    return (
      <div className="navigation-wrapper">
        <Link to="/">
          <img src={globe} alt="" className="header-logo" />
        </Link>
      </div>
    );
  })
);
