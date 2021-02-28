import { makeAutoObservable, runInAction } from 'mobx';
import { themes, getTheme, setTheme } from '../utils/themes';
import { createContext, useContext } from 'react';
import events from '../utils/events';

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

    const response = await (
      await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      })
    ).json();

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

    const response = await (
      await fetch('/api/register', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      })
    ).json();

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

    const response = await (
      await fetch('/api/logout', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
    ).json();

    if (response.okay) {
      runInAction(() => (store.user = null));
    }

    events.trigger('notify', response);

    runInAction(() => (store.isLoading = false));

    return response;
  },

  getUserInfo: async () => {
    runInAction(() => (store.isLoading = true));

    const result = await (
      await fetch('/api/userInfo', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
    ).json();

    if (result.okay) {
      runInAction(() => (store.user = result.okay));
    }

    runInAction(() => (store.isLoading = false));

    return result;
  },
};

makeAutoObservable(store);

store.getUserInfo();

const StoreContext = createContext(store);
const useStore = () => useContext(StoreContext);

export { store, StoreContext, useStore };
