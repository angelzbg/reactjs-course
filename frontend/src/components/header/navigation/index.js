import './styles/navigation.css';
import { Link, withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import { useStore } from '../../../store/store';
import { links } from '../constants';

export default withRouter(
  observer(({ location: { pathname } }) => {
    const { user } = useStore();

    return (
      <div className="navigation-wrapper">
        {links.map(({ path, name, icon, auth }, i) => (
          <Link
            key={`nav-link-${i}`}
            to={auth && !user ? auth : path}
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
