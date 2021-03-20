import { observer } from 'mobx-react';
import { SyncIcon } from '@primer/octicons-react';

export default observer(({ filters, filtersActive, setFilter, syncing, sync }) => (
  <div className="home-filters-wrap">
    {Object.values(filters).map((filter) => (
      <div
        key={`home-f-${filter}`}
        className={`home-filter ${!filtersActive.includes(filter) ? 'inactive' : ''}`}
        onClick={() => setFilter(filter)}
      >
        {filter}
      </div>
    ))}
    <div className={`home-sync ${syncing ? 'syncing' : ''}`} onClick={sync}>
      <SyncIcon size="small" />
    </div>
  </div>
));
