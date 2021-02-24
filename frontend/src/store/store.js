import { makeAutoObservable } from 'mobx';
import { themes, getTheme, setTheme } from '../utils/themes';
import { createContext, useContext } from 'react';

const store = {
  isLoading: true,
  user: null,

  theme: getTheme(),
  themes: themes,
  nextTheme: async (theme) => {
    store.theme = setTheme(theme);
  },
};

makeAutoObservable(store);

const StoreContext = createContext(store);
const useStore = () => useContext(StoreContext);

export { store, StoreContext, useStore };
