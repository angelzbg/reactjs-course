import { makeAutoObservable, runInAction } from 'mobx';
import { getTimeDifference, networkCall, notify } from '../../utils/utils';

export default class DevelopersStore {
  constructor(root) {
    makeAutoObservable(this);
    this.root = root;
  }

  filters = {
    new: 'New Developers',
    top: 'Top Rated Developers',
    'new-local': 'New Local Developers',
    'top-local': 'Top Rated Local Developers',
  };

  isValidFilter = (filter = '', isAuthenticated = false) => {
    const authFilters = ['new-local', 'top-local'];
    if (Object.keys(this.filters).includes(filter) && (!isAuthenticated ? !authFilters.includes(filter) : true)) {
      return true;
    }

    return false;
  };

  filter = '';
  setFilter = (filter = '') => {
    if (this.filter !== filter) {
      this.filter = filter;
      this.getData();
    }
  };

  get canSync() {
    return !this.loading && !this.syncing && !this.paginating;
  }

  get canPaginate() {
    return this.allowPaginate && !this.paginating && !this.syncing;
  }

  getfilterBody = () => {
    const criteria = {
      new: () => ({ created: this.data[this.data.length - 1]?.created ?? Number.MAX_SAFE_INTEGER }),
      'new-local': () => ({ created: this.data[this.data.length - 1]?.created ?? Number.MAX_SAFE_INTEGER }),
      /*top: { rating: this.data[this.data.length]?.rating ?? 5 },
      'top-local': { rating: this.data[this.data.length]?.rating ?? 5 },*/
    };
    return criteria[this.filter]?.() || {};
  };

  get items() {
    const yearAgo = new Date().getTime() - 34712647200;
    return this.data.map((item) => {
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
    });
  }

  paginating = false;
  allowPaginate = false;
  loading = false;
  syncing = false;
  data = [];
  getData = async (skip = 0, limit = 12, isLoad = true, isSync = false) => {
    runInAction(() => (isLoad ? (this.loading = true) : isSync ? (this.syncing = true) : (this.paginating = true)));

    const response = await networkCall({
      path: '/api/developers',
      method: 'POST',
      body: { skip, limit, filter: this.filter, ...(isLoad || isSync ? {} : this.getfilterBody()) },
    });

    if (response.error) {
      notify(response);
    } else {
      runInAction(() => {
        this.data = isSync || isLoad ? response.okay : this.data.concat(response.okay);
        this.allowPaginate = response.okay.length === limit;
      });
    }

    runInAction(() => (isLoad ? (this.loading = false) : isSync ? (this.syncing = false) : (this.paginating = false)));

    return response;
  };
}
