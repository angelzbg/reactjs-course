import { makeAutoObservable, runInAction } from 'mobx';
import { getTimeDifference, networkCall, notify } from '../../utils/utils';

export default class SearchStore {
  constructor(root) {
    makeAutoObservable(this);
    this.root = root;
  }

  results = [];
  loading = false;
  noresults = false;
  saved = false;
  getResults = async (type, name, city) => {
    runInAction(() => (this.loading = true));

    const response = await networkCall({ path: `/api/search`, method: 'POST', body: { type, name, city } });
    if (response.okay) {
      runInAction(() => {
        this.results = response.okay;
        this.saved = !!response.okay.length;
        this.noresults = !response.okay.length;
      });
    } else {
      notify(response);
    }

    runInAction(() => (this.loading = false));

    return response;
  };

  get items() {
    const yearAgo = new Date().getTime() - 34712647200;
    return this.results.map((item) => {
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
}
