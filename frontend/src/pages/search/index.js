import './styles/search.css';
import { observer, useLocalObservable } from 'mobx-react';
import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { useStore } from '../../store/store';
import SearchLoader from '../../components/loaders/SearchLoader';
import { SearchIcon } from '@primer/octicons-react';
import { runInAction } from 'mobx';
import SearchBar from './SearchBar';
import UserCard from './UserCard';

export default observer(() => {
  const history = useHistory();
  const params = new URLSearchParams(history.location.search);
  const [type, name, city] = [params.get('type'), params.get('name'), params.get('city')];
  const { searchStore } = useStore();

  const observable = useLocalObservable(() => ({
    typeVal: ['Developer', 'Organization'].includes(type) ? type : '',
    nameVal: name || '',
    cityVal: city || '',
    valueChange: ({ target: { name, value } }) => (observable[name] = value),
  }));

  useEffect(() => {
    if (['Developer', 'Organization'].includes(type) && (name || city) && !searchStore.loading && !searchStore.saved) {
      searchStore.getResults(type, name, city);
    }

    return () => {
      runInAction(() => {
        searchStore.noresult = false;
      });
    };
  }, [searchStore, observable, type, name, city]);

  const { typeVal, nameVal, cityVal, valueChange } = observable;
  const isValid = !!observable.typeVal && (!!observable.nameVal || !!observable.cityVal);

  return (
    <>
      <SearchBar {...{ searchStore, nameVal, typeVal, cityVal, isValid, valueChange, history }} />
      {searchStore.loading ? (
        <SearchLoader />
      ) : searchStore.noresults ? (
        <div className="search-no-results">No results found</div>
      ) : (
        searchStore.items.map((item, i) => <UserCard key={`u-s-c-${i}`} {...{ item, i }} />)
      )}
    </>
  );
});
