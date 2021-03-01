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
      runInAction(() => (store.user = null));
    }

    events.trigger('notify', response);

    runInAction(() => (store.isLoading = false));

    return response;
  },

  getUserInfo: async () => {
    runInAction(() => (store.isLoading = true));

    const response = await networkCall({ path: '/api/userInfo', method: 'GET' });

    if (response.okay) {
      runInAction(() => (store.user = response.okay));
    }

    runInAction(() => (store.isLoading = false));

    return response;
  },
};

makeAutoObservable(store);

store.getUserInfo();

const StoreContext = createContext(store);
const useStore = () => useContext(StoreContext);

export { store, StoreContext, useStore };
