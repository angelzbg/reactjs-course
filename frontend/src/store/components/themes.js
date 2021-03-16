import { themes, getTheme, setTheme } from '../../utils/themes';

const themeStore = [
  'themeStore',
  ({ root, themeStore }) => ({
    theme: getTheme(),
    themes,
    nextTheme: (theme) => (themeStore().theme = setTheme(theme)),
  }),
];

export default themeStore;
