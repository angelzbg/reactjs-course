import React from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { useStore } from '../../../../store/store';
import { StarIcon, StarFillIcon } from '@primer/octicons-react';
import { getUserRating } from '../../../../utils/utils';

export default observer(({ id, profile, isSelf, syncing, sync, setSync }) => {
  const store = useStore();
  const { rating, rounded, voters } = getUserRating(profile ? profile.ratings : []);
  const [canVote, isVoted] = [!!store.user && store.user._id !== id && !!profile, voters !== 0];

  const observable = useLocalObservable(() => ({
    hoveredStar: -1,
    setHoveredStar: (number = 0) => (observable.hoveredStar = number),
    rate: async (stars = 0, isSelf, id) => {
      setSync(true);
      (await store.rateUser(stars)).okay ? sync(!isSelf ? id : false) : setSync(false);
    },
  }));

  return (
    <div className="profile-card-stars">
      {new Array(5).fill(0).map((_, i) => {
        const isFilled =
          (isVoted && i < /*=*/ rounded && observable.hoveredStar === -1) || (canVote && i <= observable.hoveredStar);
        return (
          <div
            className={`profile-card-star ${observable.hoveredStar === -1 ? (isVoted ? 'voted' : 'notvoted') : ''} ${
              canVote && observable.hoveredStar !== -1 ? 'can' : ''
            }`}
            key={`profile-card-star-${i}`}
            onMouseEnter={() => (canVote ? observable.setHoveredStar(i) : null)}
            onMouseLeave={() => observable.setHoveredStar(-1)}
            onClick={() => (canVote && !syncing ? observable.rate(i + 1, isSelf, id) : null)}
          >
            {(isFilled ? StarFillIcon : StarIcon)({ size: 'medium' })}
          </div>
        );
      })}
      <div className="profile-card-rating-text">
        /{rating.toFixed(2)} | {voters} rating(s)
      </div>
    </div>
  );
});
