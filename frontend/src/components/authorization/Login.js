import './styles/auth.css';

import React from 'react';
import { Link } from 'react-router-dom';

import { useStore } from '../../store/store';
import { observer } from 'mobx-react';

import { loginFields } from './constants';
import { FieldsObservable } from '../../utils/utils';
import Input from './partials/Input';

import { errorCodes } from '../../utils/constants';

export default observer(() => {
  const store = useStore();
  const fieldsObs = FieldsObservable(loginFields);

  const onSubmit = (event) => {
    event.preventDefault();
    if (!fieldsObs.validateFields()) {
      // Send login request
      console.log('Send login request');
    }
  };

  return (
    <div className="auth-form-wrapper">
      <form onSubmit={onSubmit} className="auth-form" autoComplete="new-password">
        {fieldsObs.fields.map(({ name, el, value, type, placeholder, error, errorMsg, highlight }, i) => (
          <div key={`input-wrapper-${i}`}>
            <div className="auth-error-wrap">
              <span className="auth-error" style={{ display: error ? 'block' : 'none' }}>
                {errorMsg}
              </span>
            </div>
            {el === 'input' && (
              <Input
                {...{
                  className: `auth-input ${error || highlight?.includes(fieldsObs.error) ? 'error' : ''}`,
                  value,
                  name,
                  type,
                  placeholder,
                  setInput: fieldsObs.setInput,
                }}
              />
            )}
          </div>
        ))}
        <button className="auth-btn" type="submit">
          Sign in
        </button>
      </form>
      <div className="auth-error-network-wrap">
        <span className="auth-error-network" style={{ display: fieldsObs.error ? 'block' : 'none' }}>
          {errorCodes[fieldsObs.error]}
        </span>
      </div>
      <div className="auth-info">
        Not a member yet? <Link to="/register">Sign up</Link>
      </div>
    </div>
  );
});
