import './App.css';

import React from 'react';
import { HashRouter, Route } from 'react-router-dom';

import { observer } from 'mobx-react';
import { useStore } from './store/store';

import Header from './components/header/Header';

export default observer(() => {
  const store = useStore();
  return (
    <HashRouter>
      <div className="app-wrapper">
        <Header />
      </div>
    </HashRouter>
  );
});
