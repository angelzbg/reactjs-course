import React from 'react';
import { observer } from 'mobx-react';
import { SyncIcon } from '@primer/octicons-react';

export default observer(({ syncing, sync }) => (
  <div className={`profile-card-refresh-icon ${syncing ? 'syncing' : ''}`} onClick={sync}>
    <SyncIcon size="small" />
  </div>
));
