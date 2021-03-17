import { makeAutoObservable, runInAction } from 'mobx';
import { networkCall, notify } from '../../utils/utils';

export default class AuthStore {
  constructor(root) {
    makeAutoObservable(this);
    this.root = root;
  }

  signIn = async (body) => {
    runInAction(() => (this.root.isLoading = true));

    const response = await networkCall({ path: '/api/login', method: 'POST', body });

    if (response.okay) {
      this.getUserInfo();
      notify(response);
    } else {
      runInAction(() => (this.root.isLoading = false));
    }

    return response;
  };

  signUp = async (body) => {
    runInAction(() => (this.root.isLoading = true));

    const response = await networkCall({ path: '/api/register', method: 'POST', body });

    if (response.okay) {
      notify(response);
      this.getUserInfo();
    } else {
      runInAction(() => (this.root.isLoading = false));
    }

    return response;
  };

  signOut = async () => {
    runInAction(() => (this.root.isLoading = true));

    const response = await networkCall({ path: '/api/logout', method: 'GET' });

    if (response.okay) {
      runInAction(() => (this.root.isLoading = false));
      runInAction(() => (this.root.user = null));
    }

    notify(response);

    return response;
  };

  getUserInfo = async (isSilent) => {
    if (!isSilent) {
      runInAction(() => (this.root.isLoading = true));
    }

    const response = await networkCall({ path: '/api/userInfo', method: 'GET' });

    if (response.okay) {
      runInAction(() => {
        if (!this.root.user) {
          this.root.user = response.okay;
        } else {
          Object.assign(this.root.user, response.okay);
        }
      });
    }

    if (!isSilent) {
      runInAction(() => (this.root.isLoading = false));
    }

    if (response.error) {
      runInAction(() => (this.root.user = this.root.user === undefined ? null : undefined));
    }

    return response;
  };
}
