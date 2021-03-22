import { makeAutoObservable, runInAction } from 'mobx';
import { createContext, useContext } from 'react';
import AuthStore from './components/auth';
import ThemeStore from './components/themes';
import ProfileStore from './pages/profile';
import HomeStore from './pages/home';
import DevelopersStore from './pages/developers';
import OrganizationsStore from './pages/organizations';
import SearchStore from './pages/search';
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
    this.searchStore = new SearchStore(this);

    this.auth.getUserInfo();
  }

  socket = null;
  disconnected = false;
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

        if (this.disconnected) {
          runInAction(() => (this.disconnected = false));

          let lastFriend, lastRequest;
          if (!this.loadingFriends) {
            lastFriend =
              this.friends
                .filter(({ users }) => users[0]._id !== this.user._id)
                .sort((a, b) => b.created - a.created)[0]?.created || 0;
          }

          if (!this.loadingRequests) {
            lastRequest = this.requests.filter(({ receiver }) => receiver._id !== this.user._id)[0]?.created || 0;
          }

          this.socket.emit('getMissedNotifications', JSON.stringify({ lastFriend, lastRequest }));

          /*if (!this.loadingFriends) {
            this.loadFriends();
          }
          if (!this.loadingRequests) {
            this.loadRequests();
          }*/
        }
      });

      this.socket.on('missedNotifications', (data) => {
        const { friends, requests } = JSON.parse(data);
        if (friends.length) {
          this.friends = friends.concat(this.friends);
        }

        if (requests.length) {
          this.requests = requests.concat(this.requests);
        }

        console.log({ friends, requests });
      });

      this.socket.on('disconnect', (reason) => {
        runInAction(() => (this.disconnected = true));
        if (reason === 'io server disconnect') {
          this.socket.connect();
        }
      });
    } else {
      this.socket.emit('subscribeSocket', this.user.socketId);
    }
  };
  close = () => {
    if (this.socket && this.user) {
      this.socket.disconnect();
      this.socket = null;
    }
    runInAction(() => (this.disconnected = false));
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

  get requestsTo() {
    return !!this.user
      ? this.requests
          .filter(({ sender }) => sender._id === this.user._id)
          .reduce((map, { receiver, created }) => Object.assign(map, { [receiver._id]: { created } }), {})
      : {};
  }

  get requestsFrom() {
    return !!this.user
      ? this.requests
          .filter(({ receiver }) => receiver._id === this.user._id)
          .reduce(
            (map, { sender, created }) =>
              Object.assign(map, { [sender._id]: { created, new: this.user.lastNotifCheck < created } }),
            {}
          )
      : {};
  }

  get friendsIds() {
    return !!this.user
      ? this.friends.map(({ users }) => (users[0]._id === this.user._id ? users[1]._id : users[0]._id))
      : [];
  }

  loadingFriends = false;
  loadFriends = async () => {
    runInAction(() => (this.loadingFriends = true));

    const response = await networkCall({ path: '/api/friends', method: 'GET' });
    if (response.okay) {
      runInAction(() => (this.friends = response.okay));
    } else {
      notify(response);
      setTimeout(() => {
        if (!this.loadingFriends) {
          this.loadFriends();
        }
      }, 5000);
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
      setTimeout(() => {
        if (!this.loadingRequests) {
          this.loadRequests();
        }
      }, 5000);
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
