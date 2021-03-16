import { runInAction } from 'mobx';
import { networkCall, notify } from '../../utils/utils';
import { homeFilters, homeFiltersActive } from '../../utils/constants';

const home = [
  'home',
  ({ root, home }) => ({
    loading: true,
    filters: homeFilters,
    filtersActive: homeFiltersActive,
    setFilter: (filter) => {
      if (home().filtersActive.includes(filter)) {
        home().filtersActive = home().filtersActive.filter((f) => f !== filter);
        if (!home().filtersActive.length) {
          home().filtersActive.push(Object.values(homeFilters).find((f) => f !== filter));
        }
      } else {
        home().filtersActive.push(filter);
      }
    },
    data: {},
    getData: async () => {
      const response = await networkCall({ path: `/home`, method: 'GET' });
      if (response.error) {
        notify(response);
      } else {
        runInAction(() => (home().data = response.okay));
      }

      if (home().loading) {
        runInAction(() => (home().loading = false));
      }

      return response;
    },
  }),
];

export default home;
