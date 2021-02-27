import './app.css';

import React from 'react';
import { HashRouter, Route } from 'react-router-dom';

import { observer } from 'mobx-react';
import { useStore } from './store/store';

import Header from './components/header/Header';
import Login from './components/authorization/Login';
import Register from './components/authorization/Register';

export default observer(() => {
  const store = useStore();
  return (
    <HashRouter>
      <div className="app-wrapper">
        <Header />
        <div className="content-wrapper scroll-h">
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
        </div>
      </div>
    </HashRouter>
  );
});
