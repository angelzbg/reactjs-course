import './styles/navigation.css';
import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import { useStore } from '../../../store/store';
import { links } from '../constants';

export default observer(
  withRouter(({ location: { pathname } }) => {
    const store = useStore();

    return (
      <div className="navigation-wrapper">
        {links.map(({ path, name, icon, auth }, i) => (
          <Link
            key={`nav-link-${i}`}
            to={auth && !store.user ? auth : path}
            className={`nav-icon-link ${pathname === path ? 'active' : 'inactive'}`}
          >
            {icon({ size: 'medium' })}
            <div className="tip-navigation">{name}</div>
          </Link>
        ))}
      </div>
    );
  })
);
