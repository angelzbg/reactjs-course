import { observer } from 'mobx-react';
import { useStore } from '../../../../store/store';
import { getTimeDifference } from '../../../../utils/utils';
import { ArrowUpIcon, ArrowDownIcon } from '@primer/octicons-react';

export default observer(({ user, profileId, commentId, likes, dislikes, syncing, action, created }) => {
  const { time } = useStore();
  const liked = !!user && likes.indexOf(user._id) !== -1;
  const disliked = !!user && dislikes.indexOf(user._id) !== -1;
  return (
    <div className="comment-status">
      <div className="ratio">
        <div
          className={`likes ${liked ? 'active' : ''}`}
          onClick={() => (!syncing && !liked ? action(user, 'like', profileId, commentId) : null)}
        >
          <ArrowUpIcon size="small" /> {likes.length}
        </div>{' '}
        <div
          className={`dislikes ${disliked ? 'active' : ''}`}
          onClick={() => (!syncing && !disliked ? action(user, 'dislike', profileId, commentId) : null)}
        >
          <ArrowDownIcon size="small" /> {dislikes.length}
        </div>
      </div>{' '}
      ‧ {getTimeDifference(created, time)}
    </div>
  );
});
