import { observer } from 'mobx-react';
import { PeopleIcon } from '@primer/octicons-react';
import { toggles } from '../constants';
import { Link } from 'react-router-dom';
import no_profile from '../../../images/no_profile.png';
import { getTimeDifference } from '../../../utils/utils';

export default observer(({ item, i, setToggle, profileStore, time }) => (
  <Link
    key={`notif-acc-${item._id}`}
    to={`/profile/${item.sender._id}`}
    className="friend-request-wrap"
    onClick={() => {
      setToggle(toggles.closed);
      profileStore.updateUserProperty('lastNotifCheck', true);
    }}
  >
    <div className="friend-request-avatar">
      <img src={item.sender.avatar ? `/avatars/${item.sender.avatar}` : no_profile} alt="avatar" />
      <div className="friend-request-icon">
        <PeopleIcon size="small" />
      </div>
    </div>
    <div className="friend-request-text">
      <b>{item.sender.name}</b> has sent you a friend request.
      <div className="friend-request-date">
        {item.new && <div className="friend-request-pointer" />} {getTimeDifference(item.created, time)}
      </div>
    </div>
  </Link>
));
