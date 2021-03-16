import './styles/loaders.css';
import React from 'react';
import { SyncIcon } from '@primer/octicons-react';

const PageLoader = () => (
  <div className="page-loader">
    <SyncIcon size="medium" />
  </div>
);

export default PageLoader;
