import React from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { useStore } from '../../../../store/store';
import { CheckCircleIcon, XCircleIcon, PencilIcon } from '@primer/octicons-react';

export default observer(({ profile, isSelf, setSync, setEditField, editField, syncing }) => {
  const store = useStore();
  const observable = useLocalObservable(() => ({
    value: '',
    error: '',
    setInput: (value = '') => {
      observable.value = value;
      observable.error = value.length < 2 ? 'error' : '';
    },
    updateField: async () => {
      setSync(true);
      const oldValue = profile.name;
      const newValue = observable.value;
      if (newValue !== oldValue) {
        const response = await store.updateUserProperty('name', newValue);
        if (response.okay) {
          setEditField(false);
          setSync(false);
        }
      } else {
        setEditField(false);
      }
    },
  }));

  const { value, error, setInput, updateField } = observable;

  return editField === 'name' ? (
    <div className="profile-card-name-input-wrap">
      <input
        className={error}
        type="text"
        placeholder="Name"
        value={value}
        onChange={(e) => setInput(e.target.value)}
      />
      {!syncing && (
        <>
          {!error && value !== profile.name && (
            <div className="accept-button" onClick={updateField}>
              <CheckCircleIcon size="medium" />
            </div>
          )}
          <div className="cancel-button" onClick={() => setEditField(false)}>
            <XCircleIcon size="medium" />
          </div>
        </>
      )}
    </div>
  ) : (
    <div className="profile-card-name-text">
      {profile.name}
      {isSelf && (
        <div className="edit-button-name" onClick={() => observable.setInput(profile.name) & setEditField('name')}>
          <PencilIcon size="small" />
        </div>
      )}
    </div>
  );
});
