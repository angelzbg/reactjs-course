import './styles/notif.css';
import { observer, useLocalObservable } from 'mobx-react';
import { useStore } from '../../../store/store';
import { toggles } from '../constants';
import { notificationsComponents } from './constants';
import { wrappersIds } from '../constants';
import Bell from './Bell';
import Header from './Header';

export default observer(({ toggle, setToggle, notifWrapRef }) => {
  const { time, profileStore, loadRequests, notifications } = useStore();
  const { list, newCount } = notifications;

  const observable = useLocalObservable(() => ({
    syncing: false,
    setSync: (syncing = false) => (observable.syncing = syncing),
    sync: async () => {
      if (observable.syncing) {
        return;
      }

      observable.setSync(true);
      await loadRequests();
      observable.setSync();
    },
  }));

  const { syncing, sync } = observable;

  return (
    <div className="notif-wrapper" id={wrappersIds.notifMenu} ref={notifWrapRef}>
      <Bell {...{ toggle, setToggle, newCount, profileStore }} />
      {toggle === toggles.notifications && (
        <div className="notif-container-wrap">
          <div className="notif-container">
            <Header {...{ syncing, sync }} />
            {!!list.length ? (
              list.map((item, i) => notificationsComponents[item.type]({ item, i, setToggle, profileStore, time }))
            ) : (
              <div className="notif-empty">Nothing new to display</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});
