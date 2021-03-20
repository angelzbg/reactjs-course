import { observer } from 'mobx-react';
import { useStore } from '../../store/store';
import { SyncIcon } from '@primer/octicons-react';

export default observer(() => {
  const { syncing, canSync, getData } = useStore().organizations;
  return (
    <div
      className={`sync-wrap ${syncing ? 'syncing' : ''}`}
      onClick={() => (canSync ? getData(0, 12 /*len*/, false, true) : null)}
    >
      <SyncIcon size="small" />
    </div>
  );
});
