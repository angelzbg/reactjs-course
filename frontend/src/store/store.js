import { makeAutoObservable, runInAction } from 'mobx';
import { createContext, useContext } from 'react';
import AuthStore from './components/auth';
import ThemeStore from './components/themes';
import ProfileStore from './pages/profile';
import HomeStore from './pages/home';
import DevelopersStore from './pages/developers';
import OrganizationsStore from './pages/organizations';
import { networkCall, notify } from '../utils/utils';
import Events from '../utils/events';
import { notificationTypes } from '../components/header/notifications/constants';

class Store {
  constructor() {
    makeAutoObservable(this);

    this.auth = new AuthStore(this);
    this.themeStore = new ThemeStore(this);
    this.profileStore = new ProfileStore(this);
    this.home = new HomeStore(this);
    this.developers = new DevelopersStore(this);
    this.organizations = new OrganizationsStore(this);

    this.auth.getUserInfo();

    Events.listen('friend-request-received', 'store', (request) =>
      runInAction(() => {
        this.requests.unshift(request);
      })
    );
    Events.listen('friend-request-accepted', 'store', ({ friend, removed }) =>
      runInAction(() => {
        this.requests = this.requests.filter(({ _id }) => _id !== removed);
        this.friends.unshift(friend);
      })
    );
    Events.listen('friend-request-removed', 'store', (id) =>
      runInAction(() => {
        this.requests = this.requests.filter(({ _id }) => _id !== id);
      })
    );
    Events.listen('friend-removed', 'store', (id) =>
      runInAction(() => {
        this.friends = this.friends.filter(({ _id }) => _id !== id);
      })
    );
  }

  isLoading = false;
  user = null;
  friends = [];
  requests = [];

  sendRequest = async (id = '') => {
    const response = await networkCall({ path: `/api/send-friend-request/${id}`, method: 'GET' });
    if (response.okay) {
      runInAction(() => this.requests.unshift(response.okay));
    } else {
      notify(response);
    }

    return response;
  };

  acceptRequest = async (id = '') => {
    const response = await networkCall({ path: `/api/accept-friend-request/${id}`, method: 'GET' });
    if (response.okay) {
      runInAction(() => {
        this.requests = this.requests.filter(({ _id }) => _id !== id);
        this.friends.unshift(response.okay);
      });
    } else {
      notify(response);
    }

    return response;
  };

  removeRequest = async (id = '') => {
    const response = await networkCall({ path: `/api/remove-friend-request/${id}`, method: 'GET' });
    if (response.okay) {
      runInAction(() => (this.requests = this.requests.filter(({ _id }) => _id !== id)));
    } else {
      notify(response);
    }

    return response;
  };

  removeFriend = async (id = '') => {
    const response = await networkCall({ path: `/api/friends/remove/${id}`, method: 'GET' });
    if (response.okay) {
      runInAction(() => (this.friends = this.friends.filter(({ _id }) => _id !== id)));
    } else {
      notify(response);
    }

    return response;
  };

  get notifications() {
    let seen = 0;
    let weekAgo = new Date().getTime() - 604800000;
    const lastNotifCheck = this.user.lastNotifCheck;
    const request = this.requests
      .filter(({ receiver }) => receiver._id === this.user._id)
      .map((r) => ({ ...r, type: notificationTypes.friendRequest }));

    const accepted = this.friends
      .filter(({ users: [_, sender], created }) => sender._id === this.user._id && created > weekAgo)
      .map((f) => ({ ...f, type: notificationTypes.friendAccepted }));

    const list = request
      .concat(accepted)
      .map((n) => ({ ...n, new: n.created > lastNotifCheck || !++seen }))
      .sort((a, b) => b.created - a.created);
    return { list, newCount: list.length - seen };
  }

  loadingFriends = false;
  loadFriends = async () => {
    runInAction(() => (this.loadingFriends = true));

    const response = await networkCall({ path: '/api/friends', method: 'GET' });
    if (response.okay) {
      runInAction(() => (this.friends = response.okay));
    } else {
      notify(response);
    }

    runInAction(() => (this.loadingFriends = false));

    return response;
  };

  loadingRequests = false;
  loadRequests = async () => {
    runInAction(() => (this.loadingRequests = true));
    const response = await networkCall({ path: '/api/friend-requests', method: 'GET' });
    if (response.okay) {
      runInAction(() => (this.requests = response.okay));
    } else {
      notify(response);
    }

    runInAction(() => (this.loadingRequests = false));

    return response;
  };

  time = (() => {
    const time = new Date().getTime();
    setInterval(() => runInAction(() => (this.time += 60000)), 60000);
    return time;
  })();
}

const store = new Store();

const StoreContext = createContext(store);
const useStore = () => useContext(StoreContext);

export { store, StoreContext, useStore };
