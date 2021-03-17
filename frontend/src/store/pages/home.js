import { makeAutoObservable, runInAction } from 'mobx';
import { networkCall, notify } from '../../utils/utils';
import { homeFilters, homeFiltersActive } from '../../utils/constants';

export default class HomeStore {
  constructor(root) {
    makeAutoObservable(this);
    this.root = root;
  }

  loading = true;
  filters = homeFilters;
  filtersActive = homeFiltersActive;
  setFilter = (filter) => {
    if (this.filtersActive.includes(filter)) {
      this.filtersActive = this.filtersActive.filter((f) => f !== filter);
      if (!this.filtersActive.length) {
        this.filtersActive.push(Object.values(homeFilters).find((f) => f !== filter));
      }
    } else {
      this.filtersActive.push(filter);
    }
  };

  data = {};
  getData = async () => {
    const response = await networkCall({ path: `/home`, method: 'GET' });
    if (response.error) {
      notify(response);
    } else {
      runInAction(() => (this.data = response.okay));
    }

    if (this.loading) {
      runInAction(() => (this.loading = false));
    }

    return response;
  };
}
