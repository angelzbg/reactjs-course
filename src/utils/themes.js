const colors = {
  Dark: {
    '--lightest': '#e4e6eb',
    '--light': '#b0b3b8',
    '--medium': '#3a3b3c',
    '--dark': '#242526',
    '--darker': '#18191a',
    '--link1': '#2398eb',
    '--link2': '#29a6ff',
    '--shadow1': 'rgba(0, 0, 0, 0.3)',
    '--shadow2': 'rgba(0, 0, 0, 0.1)',
    '--active': 'rgba(61, 174, 255, 1)',
    '--active-bgr': 'rgba(61, 174, 255, 0.1)',
  },
  Light: {
    '--lightest': '#ffffff',
    '--light': '#f7f7f7',
    '--medium': '#becae6',
    '--dark': '#8b9dc3',
    '--darker': '#3b5998',
    '--link1': '#2398eb',
    '--link2': '#29a6ff',
    '--shadow1': 'rgba(0, 0, 0, 0.3)',
    '--shadow2': 'rgba(0, 0, 0, 0.1)',
    '--active': 'rgba(255, 255, 255, 1)',
    '--active-bgr': 'rgba(255, 255, 255, 0.2)',
  },
};

const themes = Object.keys(colors);
const fallback = themes[0];

const getTheme = () => {
  const theme = localStorage.getItem('theme');
  return theme && colors[theme] ? theme : fallback;
};

const saveTheme = (theme = fallback) => localStorage.setItem('theme', theme);

const setColorScheme = (theme = fallback) => {
  Object.entries(colors[theme]).forEach(([color, value]) => {
    document.documentElement.style.setProperty(color, value);
  });
};

const setTheme = (() => {
  setColorScheme(getTheme());

  return (theme) => {
    theme = colors[theme] ? theme : fallback;
    setColorScheme(theme);
    saveTheme(theme);

    return theme;
  };
})();

export { themes, getTheme, setTheme, setColorScheme };
