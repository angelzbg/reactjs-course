import './styles/app-loader.css';
import React from 'react';
import { SyncIcon } from '@primer/octicons-react';

const AppLoader = () => (
  <div className="app-loader">
    <SyncIcon size="medium" />
  </div>
);

export default AppLoader;
