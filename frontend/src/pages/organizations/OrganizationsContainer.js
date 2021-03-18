import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import events from '../../utils/events';
import OrganizationCard from './OrganizationCard';
import Pagination from './Pagination';
import { useStore } from '../../store/store';

export default observer(({ section }) => {
  const { organizations, time } = useStore();

  useEffect(() => {
    events.listen('scroll-bottom', 'organizations-page', async (target) => {
      if (
        organizations.canPaginate &&
        (await organizations.getData(organizations.data.length, 12, false, false)).okay
      ) {
        target.scrollTo({ top: target.scrollTop + 120, behavior: 'smooth' });
      }
    });
    return () => {
      events.unlisten('scroll-bottom', 'organizations-page');
    };
  }, [organizations]);

  const yearAgo = new Date().getTime() - 34712647200;

  return (
    <>
      <div className="organizations-wrap">
        {organizations.data.map((item, i) => (
          <OrganizationCard key={`org-${i}`} {...{ item, i, section, yearAgo, time }} />
        ))}
      </div>
      <Pagination />
    </>
  );
});
