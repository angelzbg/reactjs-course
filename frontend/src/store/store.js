import { makeAutoObservable, runInAction } from 'mobx';
import { createContext, useContext } from 'react';
import AuthStore from './components/auth';
import ThemeStore from './components/themes';
import ProfileStore from './pages/profile';
import HomeStore from './pages/home';
import DevelopersStore from './pages/developers';
import OrganizationsStore from './pages/organizations';

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

  isLoading = false;
  user = null;

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
