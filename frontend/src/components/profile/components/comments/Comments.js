import './styles/comments.css';
import React, { useEffect } from 'react';
import { useStore } from '../../../../store/store';
import { observer, useLocalObservable } from 'mobx-react';
import { runInAction } from 'mobx';

export default observer(({ id }) => {
  const store = useStore();
  const observable = useLocalObservable(() => ({
    syncing: false,
    setSync: (isSync = true) => runInAction(() => (observable.syncing = isSync)),
    sync: async (id) => {
      observable.setSync(true);
      observable.setEditField(false);
      //await (id ? store.getUserProfile(id) : store.getUserInfo());
      observable.setSync(false);
    },
  }));

  return <div className="comments-profile-wrapper"></div>;
});
