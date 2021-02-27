import './styles/auth.css';

import React from 'react';
import { Link } from 'react-router-dom';

import { useStore } from '../../store/store';
import { observer } from 'mobx-react';

import { registerFields } from './constants';
import { FieldsObservable } from '../../utils/utils';
import Input from './partials/Input';

import { errorCodes } from '../../utils/constants';

export default observer(() => {
  const store = useStore();
  const fieldsObs = FieldsObservable(registerFields);

  const onSubmit = (event) => {
    event.preventDefault();
    if (!fieldsObs.validateFields()) {
      // Send register request
      console.log('Send register request');
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
          Sign up
        </button>
      </form>
      <div className="auth-error-network-wrap">
        <span className="auth-error-network" style={{ display: fieldsObs.error ? 'block' : 'none' }}>
          {errorCodes[fieldsObs.error]}
        </span>
      </div>
      <div className="auth-info">
        Already a member? <Link to="/login">Sign in</Link>
      </div>
    </div>
  );
});
