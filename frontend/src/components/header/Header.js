import './styles/header.css';

import logo from '../../images/logo.png';

import React from 'react';
import { Link } from 'react-router-dom';

import UserMenu from './components/user/UserMenu';
import Navigation from './components/navigation/Navigation';

const Header = () => (
  <div className="header-wrapper">
    <Link to="/">
      <img src={logo} alt="" className="header-logo" />
    </Link>
    <Navigation />
    <UserMenu />
  </div>
);

export default Header;