import './app.css';
import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { observer } from 'mobx-react';
import { useStore } from './store/store';
import AppLoader from './components/loaders/AppLoader';
import Notifications from './components/notifications/index';
import Header from './components/header/index';
import Login from './pages/authorization/login/index';
import Register from './pages/authorization/register/index';
import Profile from './pages/profile/index';
import Home from './pages/home/index';

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
          </Switch>
        </div>
        <Notifications />
        {store.isLoading && <AppLoader />}
      </div>
    </HashRouter>
  );
});
