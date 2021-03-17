import { runInAction } from 'mobx';
import { useLocalObservable } from 'mobx-react-lite';

export const useHomeObservable = (getData) => {
  const observable = useLocalObservable(() => ({
    syncing: false,
    sync: async () => {
      runInAction(() => (observable.syncing = true));
      await getData();
      runInAction(() => (observable.syncing = false));
    },
  }));

  return observable;
};

export const getContainers = (data = {}, filters = {}, isAuth = false, activeFilters = []) => {
  return [
    {
      title: 'New Local Developers',
      auth: true,
      data: data.newDevsNear,
      filter: filters.Developers,
      link: '/developers/new-local',
    },
    {
      title: 'New Local Organizations',
      auth: true,
      data: data.newOrgsNear,
      filter: filters.Oragnization,
      link: '/organizations/new-local',
    },
    { title: 'New Developers', data: data.newDevs, filter: filters.Developers, link: '/developers/new' },
    { title: 'New Organizations', data: data.newOrgs, filter: filters.Oragnization, link: '/organizations/new' },
    {
      title: 'Top Local Developers',
      auth: true,
      data: data.topDevsNear,
      filter: filters.Developers,
      link: '/developers/top-local',
    },
    {
      title: 'Top Local Organizations',
      auth: true,
      data: data.topOrgsNear,
      filter: filters.Oragnization,
      link: '/organizations/top-local',
    },
    { title: 'Top Developers', data: data.topDevs, filter: filters.Developers, link: '/developers/top' },
    { title: 'Top Organizations', data: data.topOrgs, filter: filters.Oragnization, link: '/organizations/top' },
  ].filter(({ filter, auth }) => activeFilters.includes(filter) && (!isAuth ? !auth : true));
};
