import { makeAutoObservable, runInAction } from 'mobx';
import events from '../../utils/events';
import { networkCall, notify } from '../../utils/utils';

export default class ProfileStore {
  constructor(root) {
    makeAutoObservable(this);
    this.root = root;
  }

  loadingProfile = false;
  profile = null;
  getUserProfile = async (id = '') => {
    runInAction(() => {
      this.loadingProfile = true;
      if (this.profile && this.profile._id !== id) {
        this.profile = null;
      }
    });

    const response = await networkCall({ path: `/api/profile/${id}`, method: 'GET' });

    runInAction(() => {
      this.profile = response.okay ?? null;
      this.loadingProfile = false;
    });

    if (response.error) {
      notify(response);
    }

    return response;
  };

  updateUserProperty = async (property = '', value = '') => {
    const response = await networkCall({
      path: `/api/userInfo/${this.root.user._id}`,
      method: 'POST',
      body: { [property]: value },
    });

    if (response.error) {
      notify(response);
    } else {
      runInAction(() => {
        this.root.user[property] = response.okay;
        if (this.profile && this.profile._id === this.root.user._id) {
          this.profile[property] = response.okay;
        }
      });
    }

    return response;
  };

  rateUser = async (stars = 1) => {
    const response = await networkCall({
      path: `/api/rateUser/${this.profile._id}`,
      method: 'POST',
      body: { stars },
    });
    if (response.error) {
      notify(response);
    } else {
      events.trigger('rated', this.profile._id);
    }

    return response;
  };

  loadingRatings = true;
  ratings = [];
  getRatings = async (id = '', inSync = false) => {
    if (!inSync) {
      runInAction(() => (this.loadingRatings = true));
    }

    const response = await networkCall({ path: `/api/ratings/${id}`, method: 'GET' });
    runInAction(() => {
      this.ratings = response.okay ?? [];
      this.loadingRatings = false;
    });

    if (response.error) {
      notify(response);
    }

    return response;
  };

  commentUser = async (content = '', id = '') => {
    const response = await networkCall({
      path: `/api/comments/${id}`,
      method: 'POST',
      body: { content },
    });
    if (response.error) {
      notify(response);
    } else {
      events.trigger('commented', id);
    }

    return response;
  };

  actionComment = async (action, id) => {
    const response = await networkCall({ path: `/api/comments/action/${id}`, method: 'POST', body: { action } });
    if (response.error) {
      notify(response);
    }

    return response;
  };

  loadingComments = true;
  comments = [];
  getComments = async (id = '', inSync = false) => {
    if (!inSync) {
      runInAction(() => (this.loadingComments = true));
    }

    const response = await networkCall({ path: `/api/comments/${id}`, method: 'GET' });
    runInAction(() => {
      this.comments = response.okay ?? [];
      this.loadingComments = false;
    });

    if (response.error) {
      notify(response);
    }

    return response;
  };
}
