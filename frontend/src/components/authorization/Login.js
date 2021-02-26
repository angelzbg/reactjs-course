import './styles/auth.css';

import React from 'react';
import { Link } from 'react-router-dom';

import { useStore } from '../../store/store';
import { observer } from 'mobx-react';

import { loginFields } from './constants';
import { FieldsObserver } from '../../utils/utils';
import Input from './partials/Input';

export default observer(() => {
  const store = useStore();
  const observable = FieldsObserver(loginFields);

  const onSubmit = (event) => {
    event.preventDefault();
    if (!observable.validateFields()) {
      // Send login request
      console.log('Send login request');
    }
  };

  return (
    <div className="login-wrapper">
      <form onSubmit={onSubmit} className="auth-form" autoComplete="new-password">
        {observable.fields.map(({ name, el, value, type, placeholder, error, errorMsg }, i) => (
          <div key={`input-wrapper-${i}`}>
            {el === 'input' && (
              <Input
                {...{
                  className: `auth-input ${error ? 'error' : ''}`,
                  value,
                  name,
                  type,
                  placeholder,
                  setInput: observable.setInput,
                }}
              />
            )}
            <div className="auth-error-wrap">
              <span className="auth-error" style={{ display: error ? 'block' : 'none' }}>
                {errorMsg}
              </span>
            </div>
          </div>
        ))}
        <button className="auth-btn" type="submit">
          Sign in
        </button>
      </form>
      <div className="auth-error-network-wrap">
        <span className="auth-error-network" style={{ display: observable.error ? 'block' : 'none' }}>
          Wrong credentials!
        </span>
      </div>
      <div className="auth-info">
        Not a member yet? <Link to="/register">Sign up</Link>
      </div>
    </div>
  );
});
