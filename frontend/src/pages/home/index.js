import './styles/home.css';
import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { useStore } from '../../store/store';
import PageLoader from '../../components/loaders/PageLoader';
import HorizontalContainer from './HorizontalContainer';
import { useHomeObservable, getContainers } from './constants';
import { SyncIcon } from '@primer/octicons-react';

export default observer(() => {
  const store = useStore();
  const { user, home, time } = store;
  const { loading, data, getData, filters, filtersActive, setFilter } = home;
  const { syncing, sync } = useHomeObservable(getData);

  useEffect(() => (!store.isLoading ? getData() : null), [store, user, getData]);

  if (loading) {
    return <PageLoader />;
  }

  const yearAgo = new Date().getTime() - 34712647200;

  return (
    <>
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
      {getContainers(data, filters, !!user, filtersActive).map(({ title, data, link }) => (
        <HorizontalContainer key={`container-h-${title}`} {...{ title, data, yearAgo, time, link }} />
      ))}
    </>
  );
});
