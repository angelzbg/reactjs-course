import './styles/app.css';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { observer } from 'mobx-react';
import { useStore } from './store/store';
import AppLoader from './components/loaders/AppLoader';
import Notifications from './components/notifications';
import Header from './components/header';
import Login from './pages/authorization/login';
import Register from './pages/authorization/register';
import Profile from './pages/profile';
import Home from './pages/home/index';
import Developers from './pages/developers';
import Organizations from './pages/organizations';
import { onAppScroll } from './utils/utils';

export default observer(() => {
  const store = useStore();
  return (
    <HashRouter>
      <div className="app-wrapper">
        <Header />
        <div className="content-wrapper scroll-h" onScroll={onAppScroll}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/profile/:id" component={Profile} />
            <Route exact path="/developers/:section?" component={Developers} />
            <Route exact path="/organizations/:section?" component={Organizations} />
          </Switch>
        </div>
        <Notifications />
        {store.isLoading && <AppLoader />}
      </div>
    </HashRouter>
  );
});
