import './app.css';

import React from 'react';
import { HashRouter, Route } from 'react-router-dom';

import { observer } from 'mobx-react';
import { useStore } from './store/store';

import Header from './components/header/Header';
import Login from './components/authorization/Login';

export default observer(() => {
  const store = useStore();
  return (
    <HashRouter>
      <div className="app-wrapper">
        <Header />
        <div className="content-wrapper scroll-h">
          <Route exact path="/login" component={Login} />
        </div>
      </div>
    </HashRouter>
  );
});
