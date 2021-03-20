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
  const { user, home, time } = store;
  const { loading, data, getData, filters, filtersActive, setFilter } = home;
  const { syncing, sync, yearAgo } = useHomeObservable(getData);

  useEffect(() => (!store.isLoading ? getData() : null), [store, user, getData]);

  document.title = 'Home - Webby';

  if (loading) {
    return <PageLoader />;
  }

  return (
    <>
      <Header {...{ filters, filtersActive, setFilter, syncing, sync }} />
      {getContainers(data, filters, !!user, filtersActive).map(({ title, data, link }) => (
        <HorizontalContainer key={`container-h-${title}`} {...{ title, data, yearAgo, time, link }} />
      ))}
    </>
  );
});
