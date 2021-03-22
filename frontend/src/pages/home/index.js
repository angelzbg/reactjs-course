import './styles/home.css';
import { observer } from 'mobx-react';
import { useEffect } from 'react';
import { useStore } from '../../store/store';
import PageLoader from '../../components/loaders/PageLoader';
import HorizontalContainer from './HorizontalContainer';
import Header from './Header';
import { useHomeObservable, getContainers } from './constants';

export default observer(() => {
  const store = useStore();
  const { user, home } = store;
  const { loading, items, getData, filters, filtersActive, setFilter } = home;
  const { syncing, sync } = useHomeObservable(getData);

  useEffect(() => (!store.isLoading && !store.userInfoFail ? getData() : null), [store, user, getData]);

  document.title = 'Home - Webby';

  if (loading) {
    return <PageLoader />;
  }

  return (
    <>
      <Header {...{ filters, filtersActive, setFilter, syncing, sync }} />
      {items &&
        getContainers(items, filters, !!user, filtersActive).map((container) => (
          <HorizontalContainer key={`container-h-${container.title}`} {...container} />
        ))}
    </>
  );
});
