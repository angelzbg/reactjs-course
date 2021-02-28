import './styles/notifications.css';

import React, { useEffect } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import events from '../../utils/events';
import { networkCodes } from '../../utils/constants';
import { SyncIcon, InfoIcon, IssueOpenedIcon } from '@primer/octicons-react';

const getId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

const icons = {
  error: IssueOpenedIcon,
  okay: InfoIcon,
};

export default observer(() => {
  const manager = useLocalObservable(() => ({
    notifications: [],
    add: (entry) => {
      const readable = Object.entries(entry).shift();
      const notification = {
        id: getId(),
        type: readable[0],
        msg: networkCodes[readable[1]],
      };
      manager.notifications.unshift(notification);
      setTimeout(() => {
        manager.remove(notification.id);
      }, 5000);
    },
    remove: (removeId) => {
      const foundIndex = manager.notifications.findIndex(({ id }) => id === removeId);
      if (foundIndex !== -1) {
        manager.notifications.splice(foundIndex, 1);
      }
    },
  }));

  useEffect(() => {
    events.listen('notify', 'notifications', manager.add);

    return () => {
      events.unlisten('notify', 'notifications');
    };
  }, [manager]);

  return (
    <div className="notifications-container">
      {manager.notifications.map(({ id, type, msg }) => (
        <div key={id} className={`notification-wrapper ${type}`}>
          <div className="notification-icon-wrap">
            <SyncIcon size="medium" className="notification-icon-sync" />
            {icons[type]({ size: 'medium', className: 'notifications-icon' })}
          </div>
          <div className="notification-message">{msg}</div>
          <div className="notification-dismiss" onClick={() => manager.remove(id)}>
            DISMISS
          </div>
          <div className="notification-loader-outer">
            <div className="notification-loader-inner" />
          </div>
        </div>
      ))}
    </div>
  );
});
