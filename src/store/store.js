import { makeAutoObservable } from 'mobx';
import { themes, getTheme, setTheme } from '../utils/themes';
import { createContext, useContext } from 'react';

import { auth, database, storage } from '../firebase/firebase';

const store = {
  isLoading: true,
  authLoaded: false,
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

auth.onAuthStateChanged((user) => {
  store.user = user;
  store.authLoaded = true;
  store.isLoading = false;
});

export { store, StoreContext, useStore };
