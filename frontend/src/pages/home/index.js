import './styles/home.css';
import { observer, useLocalObservable } from 'mobx-react';
import React, { useEffect } from 'react';
import { useStore } from '../../store/store';
import PageLoader from '../../components/loaders/PageLoader';
import HorizontalContainer from './HorizontalContainer';
import { getContainers } from './constants';
import { runInAction } from 'mobx';
import { SyncIcon } from '@primer/octicons-react';

export default observer(() => {
  const store = useStore();
  const { user, home } = store;
  const { loading, data, getData, filters, filtersActive, setFilter } = home;

  const observable = useLocalObservable(() => ({
    syncing: false,
    sync: async () => {
      runInAction(() => (observable.syncing = true));
      await getData();
      runInAction(() => (observable.syncing = false));
    },
  }));

  useEffect(() => {
    if (!store.isLoading) {
      getData();
    }
  }, [store, user, getData]);

  if (loading) {
    return <PageLoader />;
  }

  const { syncing, sync } = observable;

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
        <HorizontalContainer key={`container-h-${title}`} {...{ title, data, link }} />
      ))}
    </>
  );
});
