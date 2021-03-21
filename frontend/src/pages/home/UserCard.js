import { observer } from 'mobx-react';
import no_profile from '../../images/no_profile.png';
import { Link } from 'react-router-dom';
import { StarFillIcon, StarIcon, LocationIcon } from '@primer/octicons-react';
import CardInfo from './CardInfo';

export default observer(({ title, item }) => {
  const { _id, name, avatar, rating, votes, ratingRound, time, city, requestFrom, requestTo, isFriend } = item;
  return (
    <Link to={`/profile/${_id}`} className="user-card">
      <img className="avatar" src={avatar ? `/avatars/${avatar}` : no_profile} alt={`${name}'s avatar`} />
      <CardInfo {...{ requestFrom, requestTo, isFriend }} />
      <div className="name">{name}</div>
      <div className="rating-wrap">
        <div className="rating">
          {rating.toFixed(2)} / {votes} votes
        </div>
        {new Array(5).fill(0).map((_, i) => (
          <span key={`star-c-${_id}-${i}-${title}`}>
            {(i < ratingRound ? StarFillIcon : StarIcon)({ size: 'small' })}
          </span>
        ))}
      </div>
      <div className="location">
        <LocationIcon size="small" /> {city}
      </div>
      <div className="date">{time}</div>
    </Link>
  );
});
