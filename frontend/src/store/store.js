import { makeAutoObservable, runInAction } from 'mobx';
import { createContext, useContext } from 'react';
import AuthStore from './components/auth';
import ThemeStore from './components/themes';
import ProfileStore from './pages/profile';
import HomeStore from './pages/home';
import DevelopersStore from './pages/developers';
import OrganizationsStore from './pages/organizations';
import { networkCall, notify } from '../utils/utils';
import { notificationTypes } from '../components/header/notifications/constants';
import { io } from 'socket.io-client';

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
  }

  socket = null;
  listen = () => {
    if (!this.socket) {
      this.socket = io('/');

      this.socket.on('friend-request-received', (data) => {
        const request = JSON.parse(data);
        runInAction(() => this.requests.unshift(request));
      });

      this.socket.on('friend-request-accepted', (data) => {
        const { friend, removed } = JSON.parse(data);
        runInAction(() => {
          this.requests = this.requests.filter(({ _id }) => _id !== removed);
          this.friends.unshift(friend);
        });
      });

      this.socket.on('friend-request-removed', (data) => {
        const id = JSON.parse(data);
        runInAction(() => (this.requests = this.requests.filter(({ _id }) => _id !== id)));
      });

      this.socket.on('friend-removed', (data) => {
        const id = JSON.parse(data);
        runInAction(() => (this.friends = this.friends.filter(({ _id }) => _id !== id)));
      });

      this.socket.on('connect', () => {
        this.socket.emit('subscribeSocket', this.user.socketId);
      });
    } else {
      this.socket.emit('subscribeSocket', this.user.socketId);
    }
  };
  close = () => {
    if (this.socket) {
      this.socket.emit('unsubscribeSocket', this.user.socketId);
    }
  };

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
    const { lastNotifCheck, _id: currentUserId } = this.user;
    const requests = this.requests
      .filter(({ receiver }) => receiver._id === currentUserId)
      .map((r) => ({ ...r, type: notificationTypes.friendRequest }));

    const accepted = this.friends
      .filter(({ users: [_, sender], created }) => sender._id === currentUserId && created > weekAgo)
      .map((f) => ({ ...f, type: notificationTypes.friendAccepted }));

    const list = requests
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
