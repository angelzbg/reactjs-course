import './styles/navigation.css';

import React from 'react';
import { Link, withRouter } from 'react-router-dom';

import { observer } from 'mobx-react';
import { useStore } from '../../../../store/store';

import { FlameIcon, OctofaceIcon, OrganizationIcon, SearchIcon, HistoryIcon } from '@primer/octicons-react';

export default observer(
  withRouter(({ location: { pathname } }) => {
    const store = useStore();

    const links = [
      { path: '/', name: 'Home', icon: FlameIcon },
      { path: '/developers', name: 'Developers', icon: OctofaceIcon },
      { path: '/organizations', name: 'Organizations', icon: OrganizationIcon },
      { path: '/search', name: 'Search', icon: SearchIcon },
      { path: '/activity', name: 'Activity', icon: HistoryIcon, auth: '/login' },
    ];

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
