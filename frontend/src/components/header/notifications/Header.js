import { observer } from 'mobx-react';
import { SyncIcon } from '@primer/octicons-react';

export default observer(({ syncing, sync }) => (
  <div className="notif-header">
    Notifications{' '}
    <div className={`notif-sync ${syncing ? 'notif-syncing' : ''}`} onClick={sync}>
      <SyncIcon />
    </div>
  </div>
));
