import { makeAutoObservable, runInAction } from 'mobx';
import { getTimeDifference, networkCall, notify } from '../../utils/utils';
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

  get items() {
    if (!Object.keys(this.data).length) {
      return null;
    }

    const yearAgo = new Date().getTime() - 34712647200;
    return Object.fromEntries(
      Object.entries(this.data).map(([key, items]) => [
        key,
        items.map((item) => {
          const [requestFrom, requestTo, isFriend] = [
            this.root.requestsFrom[item._id],
            this.root.requestsTo[item._id],
            this.root.friendsIds.includes(item._id),
          ];
          return {
            ...item,
            time: `joined ${
              yearAgo < item.created
                ? getTimeDifference(item.created, this.root.time)
                : new Date(item.created).toLocaleString('en-GB', { timeZone: 'UTC' }).substring(0, 10)
            }`,
            requestFrom,
            requestTo,
            isFriend,
          };
        }),
      ])
    );
  }

  data = {};
  getData = async () => {
    const response = await networkCall({ path: `/api/home`, method: 'GET' });
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
