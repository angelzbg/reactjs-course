import './app.css';
import React from 'react';
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

export default observer(() => {
  const store = useStore();
  return (
    <HashRouter>
      <div className="app-wrapper">
        <Header />
        <div className="content-wrapper scroll-h">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/profile/:id" component={Profile} />
            <Route path="/developers/:section?" component={Developers} />
          </Switch>
        </div>
        <Notifications />
        {store.isLoading && <AppLoader />}
      </div>
    </HashRouter>
  );
});
