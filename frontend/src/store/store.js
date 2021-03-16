import { makeAutoObservable, runInAction } from 'mobx';
import { createContext, useContext } from 'react';
import auth from './components/auth';
import themeStore from './components/themes';
import profileStore from './pages/profile';
import home from './pages/home';

const store = {
  time: (() => {
    const time = new Date().getTime();
    setInterval(() => runInAction(() => (store.time += 60000)), 60000);
    return time;
  })(),

  isLoading: false,
  user: null,
};

// Extendings
[auth, themeStore, profileStore, home].forEach(([name = '', init = () => {}]) =>
  Object.assign((store[name] = {}), init({ root: () => store, [name]: () => store[name] }))
);

makeAutoObservable(store);

store.auth.getUserInfo();

const StoreContext = createContext(store);
const useStore = () => useContext(StoreContext);

export { store, StoreContext, useStore };
