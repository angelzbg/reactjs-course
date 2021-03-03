import React from 'react';
import { observer } from 'mobx-react';
import { useStore } from '../../../../../store/store';
import { PersonIcon, NorthStarIcon, SignOutIcon } from '@primer/octicons-react';
import Themes from './Themes';
import AuthCard from './AuthCard';
import { toggles } from '../../../constants';
import no_profile from '../../../../../images/no_profile.png';

export default observer(({ wrapperRef, toggle, setToggle }) => {
  const { user, signOut } = useStore();

  return (
    <div id="user-menu" ref={wrapperRef} className={`user-menu-wrapper ${toggle ? 'active' : 'inactive'}`}>
      <div
        className={`profile-icon ${user ? 'logged' : ''}`}
        onClick={() => setToggle(!toggle ? toggles.main : toggles.closed)}
      >
        {user ? (
          <>
            <div className="user-menu-name">{user.name.split(' ').shift()}</div>
            <img className="user-menu-avatar" src={user.avatar ? `avatars/${user.avatar}` : no_profile} alt="avatar" />
          </>
        ) : (
          <PersonIcon />
        )}
      </div>
      {toggle === toggles.main && (
        <div className="user-menu-pop">
          <AuthCard {...{ setToggle }} />
          <div className="user-menu-separator" />
          <div className="user-menu-item" onClick={() => setToggle(toggles.themes)}>
            <div className="user-menu-icon">
              <NorthStarIcon />
            </div>{' '}
            <div className="user-menu-title">Change theme</div>
          </div>
          <div className="user-menu-separator" />
          <div
            className="user-menu-item"
            onClick={async () => {
              const response = await signOut();
              if (response.okay) {
                setToggle(toggles.closed);
              }
            }}
          >
            <div className="user-menu-icon">
              <SignOutIcon />
            </div>{' '}
            <div className="user-menu-title">Sign out</div>
          </div>
        </div>
      )}
      {toggle === toggles.themes && <Themes {...{ setToggle }} />}
    </div>
  );
});
