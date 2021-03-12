import React from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { useStore } from '../../../store/store';
import { observer, useLocalObservable } from 'mobx-react';
import { commentsFilter } from '../constants';
import { iconsByType } from '../../../utils/constants';
import { StarFillIcon, StarIcon, LocationIcon, ArrowUpIcon, ArrowDownIcon, TrashIcon } from '@primer/octicons-react';
import { getTimeDifference } from '../../../utils/utils';
import no_profile from '../../../images/no_profile.png';
import CommentDeleteModal from './CommentDeleteModal';

export default observer(({ id, filter, syncing, setSync, sync, commentRef }) => {
  const history = useHistory();
  const { user, comments, actionComment } = useStore();
  const observable = useLocalObservable(() => ({
    deleteId: '',
    setDeleteId: (id = '') => (observable.deleteId = id),
    action: async (action = '', profileId = '', commentId = '') => {
      if (!user) return history.push('/login');
      setSync(true);
      if (action === 'delete') {
        const id = observable.deleteId;
        observable.setDeleteId();
        (await actionComment('delete', id)).okay ? sync(profileId) : setSync(false);
      } else {
        (await actionComment(action, commentId)).okay ? sync(profileId) : setSync(false);
      }
    },
  }));

  const { deleteId, setDeleteId, action } = observable;
  const maxHeight = `calc(100vh - 318px - ${commentRef?.current?.clientHeight ?? 0 + 12}px)`;

  return (
    <div className="comments-wrapper" style={{ maxHeight }}>
      {deleteId && <CommentDeleteModal {...{ id, setDeleteId, action }} />}
      {comments
        .slice()
        .sort(commentsFilter[filter])
        .map(({ _id, likes, dislikes, userId: author, content, created }) => {
          const liked = !!user && likes.indexOf(user._id) !== -1;
          const disliked = !!user && dislikes.indexOf(user._id) !== -1;
          return (
            <div key={`comment-${_id}`} className="comment">
              <Link to={`/profile/${author._id}`}>
                <img
                  className="comment-avatar"
                  src={author.avatar ? `/avatars/${author.avatar}` : no_profile}
                  alt={`${author.name} profile avatar`}
                />
              </Link>
              <div className="comment-content">
                {user._id === author._id && (
                  <div className="comment-delete-wrap">
                    <div className="comment-delete" onClick={() => (!syncing ? setDeleteId(_id) : null)}>
                      <TrashIcon size="small" />
                    </div>
                  </div>
                )}
                <div className="author-info">
                  <Link to={`/profile/${author._id}`} className="comment-author">
                    {author.name}
                  </Link>
                  {iconsByType[author.type]({ size: 'small', className: 'author-type' })}
                  <span style={{ color: 'var(--medium2)' }}> | </span>
                  <div className={`author-rating ${author.votes > 0 ? 'voted' : ''}`}>
                    {new Array(5).fill(0).map((_, i) => (
                      <span key={`star-${_id}-${author._id}-${i}`}>
                        {(i < author.ratingRound ? StarFillIcon : StarIcon)({ size: 'small' })}
                      </span>
                    ))}
                  </div>
                  <span style={{ color: 'var(--medium2)' }}> | </span>
                  <div className="author-location">
                    <LocationIcon size="small" /> {author.city}
                  </div>
                </div>
                {content}
              </div>
              <div className="comment-status">
                <div className="ratio">
                  <div
                    className={`likes ${liked ? 'active' : ''}`}
                    onClick={() => (!syncing && !liked ? action('like', id, _id) : null)}
                  >
                    <ArrowUpIcon size="small" /> {likes.length}
                  </div>{' '}
                  <div
                    className={`dislikes ${disliked ? 'active' : ''}`}
                    onClick={() => (!syncing && !disliked ? action('dislike', id, _id) : null)}
                  >
                    <ArrowDownIcon size="small" /> {dislikes.length}
                  </div>
                </div>{' '}
                ‧ {getTimeDifference(created)}
              </div>
            </div>
          );
        })}
    </div>
  );
});
