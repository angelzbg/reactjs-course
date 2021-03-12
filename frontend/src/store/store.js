import { makeAutoObservable, runInAction } from 'mobx';
import { themes, getTheme, setTheme } from '../utils/themes';
import { createContext, useContext } from 'react';
import events from '../utils/events';
import { networkCall } from '../utils/utils';

const store = {
  isLoading: false,
  user: null,

  theme: getTheme(),
  themes,
  nextTheme: async (theme) => {
    store.theme = setTheme(theme);
  },

  signIn: async (body) => {
    runInAction(() => (store.isLoading = true));

    const response = await networkCall({ path: '/api/login', method: 'POST', body });

    if (response.okay) {
      store.getUserInfo();
      events.trigger('notify', response);
    } else {
      runInAction(() => (store.isLoading = false));
    }

    return response;
  },

  signUp: async (body) => {
    runInAction(() => (store.isLoading = true));

    const response = await networkCall({ path: '/api/register', method: 'POST', body });

    if (response.okay) {
      events.trigger('notify', response);
      store.getUserInfo();
    } else {
      runInAction(() => (store.isLoading = false));
    }

    return response;
  },

  signOut: async () => {
    runInAction(() => (store.isLoading = true));

    const response = await networkCall({ path: '/api/logout', method: 'GET' });

    if (response.okay) {
      runInAction(() => (store.isLoading = false));
      runInAction(() => (store.user = null));
    }

    events.trigger('notify', response);

    return response;
  },

  getUserInfo: async (isSilent) => {
    if (!isSilent) {
      runInAction(() => (store.isLoading = true));
    }

    const response = await networkCall({ path: '/api/userInfo', method: 'GET' });

    if (response.okay) {
      runInAction(() => (store.user = response.okay));
    }

    if (!isSilent) {
      runInAction(() => (store.isLoading = false));
    }

    return response;
  },

  updateUserProperty: async (property = '', value = '') => {
    const response = await networkCall({
      path: `/api/userInfo/${store.user._id}`,
      method: 'POST',
      body: { [property]: value },
    });

    if (response.error) {
      events.trigger('notify', response);
    } else {
      runInAction(() => {
        store.user[property] = response.okay;
        if (store.profile && store.profile._id === store.user._id) {
          store.profile[property] = response.okay;
        }
      });
    }

    return response;
  },

  loadingProfile: false,
  profile: null,
  getUserProfile: async (id = '') => {
    runInAction(() => {
      store.loadingProfile = true;
      if (store.profile && store.profile._id !== id) {
        store.profile = null;
      }
    });

    const response = await networkCall({ path: `/api/profile/${id}`, method: 'GET' });

    runInAction(() => {
      store.profile = response.okay ?? null;
      store.loadingProfile = false;
    });

    if (response.error) {
      events.trigger('notify', response);
    }

    return response;
  },

  rateUser: async (stars = 1) => {
    const response = await networkCall({ path: `/api/rateUser/${store.profile._id}`, method: 'POST', body: { stars } });
    if (response.error) {
      events.trigger('notify', response);
    } else {
      events.trigger('rated', store.profile._id);
    }

    return response;
  },

  loadingRatings: true,
  ratings: [],
  getRatings: async (id = '', inSync = false) => {
    if (!inSync) {
      runInAction(() => (store.loadingRatings = true));
    }

    const response = await networkCall({ path: `/api/ratings/${id}`, method: 'GET' });
    runInAction(() => {
      store.ratings = response.okay ?? [];
      store.loadingRatings = false;
    });

    if (response.error) {
      events.trigger('notify', response);
    }

    return response;
  },

  commentUser: async (content = '') => {
    const response = await networkCall({
      path: `/api/comments/${store.profile._id}`,
      method: 'POST',
      body: { content },
    });
    if (response.error) {
      events.trigger('notify', response);
    } else {
      events.trigger('commented', store.profile._id);
    }

    return response;
  },

  actionComment: async (action, id) => {
    const response = await networkCall({ path: `/api/comments/action/${id}`, method: 'POST', body: { action } });
    if (response.error) {
      events.trigger('notify', response);
    }

    return response;
  },

  loadingComments: true,
  comments: [],
  getComments: async (id = '', inSync = false) => {
    if (!inSync) {
      runInAction(() => (store.loadingComments = true));
    }

    const response = await networkCall({ path: `/api/comments/${id}`, method: 'GET' });
    runInAction(() => {
      store.comments = response.okay ?? [];
      store.loadingComments = false;
    });

    if (response.error) {
      events.trigger('notify', response);
    }

    return response;
  },
};

makeAutoObservable(store);

store.getUserInfo();

const StoreContext = createContext(store);
const useStore = () => useContext(StoreContext);

export { store, StoreContext, useStore };
