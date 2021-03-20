import './styles/notif.css';
import { observer, useLocalObservable } from 'mobx-react';
import { useStore } from '../../../store/store';
import { toggles } from '../constants';
import { notificationTypes } from './constants';
import { wrappersIds } from '../constants';
import Bell from './Bell';
import Header from './Header';
import FriendRequest from './FriendRequest';

const typeComponent = {
  [notificationTypes.friendRequest]: (props) => <FriendRequest key={`notif-acc-${props.item._id}`} {...props} />,
};

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
            {list.map((item, i) => typeComponent[item.type]({ item, i, setToggle, profileStore, time }))}
          </div>
        </div>
      )}
    </div>
  );
});
