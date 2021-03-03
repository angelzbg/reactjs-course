import './app.css';
import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import { observer } from 'mobx-react';
import { useStore } from './store/store';
import AppLoader from './components/loaders/AppLoader';
import Notifications from './components/notifications/Notifications';
import Header from './components/header/Header';
import Login from './components/authorization/Login';
import Register from './components/authorization/Register';
import Profile from './components/profile/Profile';

export default observer(() => {
  const store = useStore();
  return (
    <HashRouter>
      <div className="app-wrapper">
        <Header />
        <div className="content-wrapper scroll-h">
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/profile/:id" component={Profile} />
        </div>
        <Notifications />
        {store.isLoading && <AppLoader />}
      </div>
    </HashRouter>
  );
});
