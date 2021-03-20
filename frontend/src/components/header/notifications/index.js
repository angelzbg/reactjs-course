import './styles/notif.css';
import React from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { useStore } from '../../../store/store';
import { BellFillIcon, PeopleIcon, SyncIcon } from '@primer/octicons-react';
import { toggles } from '../constants';
import { notificationTypes } from './constants';
import { wrappersIds } from '../constants';
import { Link } from 'react-router-dom';
import no_profile from '../../../images/no_profile.png';
import { getTimeDifference } from '../../../utils/utils';

export default observer(({ toggle, setToggle, notifWrapRef }) => {
  const { time, user, profileStore, loadingRequests, loadRequests, requests, notifications } = useStore();
  const { list, newCount } = notifications;

  const observable = useLocalObservable(() => ({
    syncing: false,
    setSync: (syncing = false) => (observable.syncing = syncing),
    sync: async () => {
      if (observable.syncing) {
        return;
      }

      observable.setSync(true);
      await loadRequests();
      observable.setSync();
    },
  }));

  const { syncing, sync } = observable;

  return (
    <div className="notif-wrapper" id={wrappersIds.notifMenu} ref={notifWrapRef}>
      <div
        className={`bell ${toggle === toggles.notifications ? 'active' : ''}`}
        onClick={() => {
          if (toggle === toggles.notifications) {
            setToggle(toggles.closed);
            profileStore.updateUserProperty('lastNotifCheck', true);
          } else {
            setToggle(toggles.notifications);
          }
        }}
      >
        <BellFillIcon size="medium" />
        {toggle !== toggles.notifications && !!newCount && <div className="notif-count">{newCount}</div>}
      </div>
      {toggle === toggles.notifications && (
        <div className="notif-container-wrap">
          <div className="notif-container">
            <div className="notif-header">
              Notifications{' '}
              <div className={`notif-sync ${syncing ? 'notif-syncing' : ''}`} onClick={sync}>
                <SyncIcon />
              </div>
            </div>
            {list.map((n, i) => {
              if (n.type === notificationTypes.friendRequest) {
                return (
                  <Link
                    to={`/profile/${n.sender._id}`}
                    key={`notif-acc-${n._id}`}
                    className="friend-request-wrap"
                    onClick={() => {
                      setToggle(toggles.closed);
                      profileStore.updateUserProperty('lastNotifCheck', true);
                    }}
                  >
                    <div className="friend-request-avatar">
                      <img src={n.sender.avatar ? `/avatars/${n.sender.avatar}` : no_profile} alt="avatar" />
                      <div className="friend-request-icon">
                        <PeopleIcon size="small" />
                      </div>
                    </div>
                    <div className="friend-request-text">
                      <b>{n.sender.name}</b> has sent you a friend request.
                      <div className="friend-request-date">
                        {n.new && <div className="friend-request-pointer" />} {getTimeDifference(n.created, time)}
                      </div>
                    </div>
                  </Link>
                );
              }
            })}
          </div>
        </div>
      )}
    </div>
  );
});
