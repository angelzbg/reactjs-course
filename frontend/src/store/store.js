import { makeAutoObservable, runInAction } from 'mobx';
import { themes, getTheme, setTheme } from '../utils/themes';
import { createContext, useContext } from 'react';

const store = {
  isLoading: false,
  user: null,

  theme: getTheme(),
  themes,
  nextTheme: async (theme) => {
    store.theme = setTheme(theme);
  },

  signIn: async ({ logon = '', password = '' }) => {
    runInAction(() => (store.isLoading = true));
    console.log(logon, password);
    const result = await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('Successful sign in mock');
      }, 2000);
    });
    runInAction(() => (store.isLoading = false));
    return result;
  },

  signUp: async ({ logon = '', password = '', repeatPassword = '' }) => {
    runInAction(() => (store.isLoading = true));
    console.log(logon, password, repeatPassword);
    const result = await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('Successful sign up mock');
      }, 2000);
    });
    runInAction(() => (store.isLoading = false));
    return result;
  },
};

makeAutoObservable(store);

const StoreContext = createContext(store);
const useStore = () => useContext(StoreContext);

export { store, StoreContext, useStore };
