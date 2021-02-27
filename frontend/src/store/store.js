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

  signIn: async ({ login = '', password = '' }) => {
    runInAction(() => (store.isLoading = true));
    console.log(login, password);
    const result = await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('Successful sign in mock');
      }, 2000);
    });
    runInAction(() => (store.isLoading = false));
    return result;
  },

  signUp: async ({ login = '', password = '', repeatPassword = '' }) => {
    runInAction(() => (store.isLoading = true));
    console.log(login, password, repeatPassword);
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
