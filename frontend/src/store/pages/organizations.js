import { makeAutoObservable, runInAction } from 'mobx';
import { networkCall, notify } from '../../utils/utils';

export default class OrganizationsStore {
  constructor(root) {
    makeAutoObservable(this);
    this.root = root;
  }

  filters = {
    new: 'New Organizations',
    top: 'Top Rated Organizations',
    'new-local': 'New Local Organizations',
    'top-local': 'Top Rated Local Organizations',
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

  paginating = false;
  allowPaginate = false;
  loading = false;
  syncing = false;
  data = [];
  getData = async (skip = 0, limit = 12, isLoad = true, isSync = false) => {
    runInAction(() => (isLoad ? (this.loading = true) : isSync ? (this.syncing = true) : (this.paginating = true)));

    const response = await networkCall({
      path: '/api/organizations',
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
