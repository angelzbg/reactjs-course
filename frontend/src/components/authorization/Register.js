import './styles/auth.css';
import React, { useRef, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { useStore } from '../../store/store';
import { observer } from 'mobx-react';
import { registerFields } from './constants';
import { FieldsObservable } from '../../utils/utils';
import RegisterAvatar from './components/RegisterAvatar';
import FormField from './components/FormField';
import { networkCodes } from '../../utils/constants';

export default observer(() => {
  const store = useStore();
  const fieldsObs = FieldsObservable(registerFields);
  const [avatar, setAvatar] = useState('');
  const avatarRef = useRef(null);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!fieldsObs.validateFields()) {
      const response = await store.signUp({ ...fieldsObs.getBody(), avatar });
      if (response.error) {
        fieldsObs.setError(response.error);
      }
    }
  };

  if (store.user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="auth-form-wrapper register">
      <form onSubmit={onSubmit} className="auth-form" autoComplete="new-password">
        {RegisterAvatar({ avatar, setAvatar, avatarRef })}

        {fieldsObs.fields.map((field, i) => (
          <FormField key={`input-wrapper-${i}`} {...{ field, fieldsObs }} />
        ))}
        <button className="auth-btn" type="submit">
          Sign up
        </button>
      </form>
      <div className="auth-error-network-wrap">
        <span className="auth-error-network" style={{ display: fieldsObs.error ? 'block' : 'none' }}>
          {networkCodes[fieldsObs.error]}
        </span>
      </div>
      <div className="auth-info">
        Already a member? <Link to="/login">Sign in</Link>
      </div>
    </div>
  );
});
