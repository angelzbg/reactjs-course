import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { screwEvent } from '../../utils/utils';
import { useStore } from '../../store/store';
import UserCard from './UserCard';
import ViewMoreCard from './ViewMoreCard';

export default observer(({ title, data, link }) => {
  const { time } = useStore();

  useEffect(() => {
    const container = document.getElementById(`container-${title}`);
    const onwheel = (event) => {
      const scrollLeft = container.scrollLeft;
      container.scrollLeft += event.deltaY * 1;
      if (scrollLeft !== container.scrollLeft) {
        screwEvent(event);
      }
    };
    container.addEventListener('mousewheel', onwheel, { passive: false });
    return () => {
      container.removeEventListener('mosuewheel', onwheel, { passive: false });
    };
  }, [title]);

  const date = new Date().getTime();

  return (
    <div className="horizontal-container-wrapper">
      <div className="wrapper-title">{title}</div>
      <div className="container-wrap">
        <div className="horizontal-container" id={`container-${title}`}>
          <div className="card-wrap">
            {data.map((item) => (
              <UserCard key={`${title}-${item._id}`} {...{ title, date, time, item }} />
            ))}
            {data.length && <ViewMoreCard {...{ type: data[0].type, link }} />}
          </div>
        </div>
      </div>
    </div>
  );
});
