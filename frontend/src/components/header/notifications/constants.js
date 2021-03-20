import FriendRequest from './FriendRequest';

const notificationTypes = {
  friendRequest: 'friend-request',
};

const notificationsComponents = {
  [notificationTypes.friendRequest]: (props) => <FriendRequest key={`notif-acc-${props.item._id}`} {...props} />,
};

export { notificationTypes, notificationsComponents };
