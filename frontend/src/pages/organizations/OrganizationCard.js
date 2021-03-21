import { observer } from 'mobx-react';
import { StarFillIcon, StarIcon, LocationIcon } from '@primer/octicons-react';
import { Link } from 'react-router-dom';
import no_profile from '../../images/no_profile.png';
import CardInfo from './CardInfo';

export default observer(({ item, i, section }) => {
  const { _id, name, avatar, rating, votes, ratingRound, time, city, requestFrom, requestTo, isFriend } = item;
  return (
    <Link key={`org-${i}`} to={`/profile/${_id}`} className="user-card" style={{ marginLeft: i % 4 !== 0 ? 8 : 0 }}>
      <img className="avatar" src={avatar ? `/avatars/${avatar}` : no_profile} alt={`${name}'s avatar`} />
      <CardInfo {...{ requestFrom, requestTo, isFriend }} />
      <div className="name">{name}</div>
      <div className="rating-wrap">
        <div className="rating">
          {rating.toFixed(2)} / {votes} votes
        </div>
        {new Array(5).fill(0).map((_, idx) => (
          <span key={`star-o-${_id}-${idx}-${i}-${section}`}>
            {(idx < ratingRound ? StarFillIcon : StarIcon)({ size: 'small' })}
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
