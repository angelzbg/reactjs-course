import { observer } from 'mobx-react';
import { CheckIcon } from '@primer/octicons-react';
import { toggles } from '../constants';
import { Link } from 'react-router-dom';
import no_profile from '../../../images/no_profile.png';
import { getTimeDifference } from '../../../utils/utils';

export default observer(({ item, setToggle, profileStore, time }) => {
  const user = item.users[0];
  return (
    <Link
      to={`/profile/${user._id}`}
      className="friend-request-wrap"
      onClick={() => {
        setToggle(toggles.closed);
        profileStore.updateUserProperty('lastNotifCheck', true);
      }}
    >
      <div className="friend-request-avatar">
        <img src={user.avatar ? `/avatars/${user.avatar}` : no_profile} alt="avatar" />
        <div className="friend-request-icon">
          <CheckIcon size="small" />
        </div>
      </div>
      <div className="friend-request-text">
        <b>You</b> and <b>{user.name}</b> are connected.
        <div className={`friend-request-date ${item.new ? 'new' : ''}`}>{getTimeDifference(item.created, time)}</div>
      </div>
    </Link>
  );
});
