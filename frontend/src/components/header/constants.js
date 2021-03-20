import { FlameIcon, OctofaceIcon, OrganizationIcon, SearchIcon, HistoryIcon } from '@primer/octicons-react';

export const wrappersIds = {
  userMenu: 'user-menu',
  notifMenu: 'notif-menu',
};

export const toggles = {
  main: 'main',
  themes: 'themes',
  notifications: 'notifications',
  closed: '',
};

export const links = [
  { path: '/', name: 'Home', icon: FlameIcon },
  { path: '/developers', name: 'Developers', icon: OctofaceIcon },
  { path: '/organizations', name: 'Organizations', icon: OrganizationIcon },
  { path: '/search', name: 'Search', icon: SearchIcon },
  { path: '/activity', name: 'Activity', icon: HistoryIcon, auth: '/login' },
];
