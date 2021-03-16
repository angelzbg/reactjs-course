import React from 'react';
import { observer } from 'mobx-react';
import { useStore } from '../../../store/store';
import { SunIcon, MoonIcon, ChevronLeftIcon } from '@primer/octicons-react';
import { setColorScheme } from '../../../utils/themes';
import { toggles } from '../constants';

export default observer(({ setToggle }) => {
  const { themeStore } = useStore();
  const themes = [
    { name: themeStore.themes[0], icon: <MoonIcon /> },
    { name: themeStore.themes[1], icon: <SunIcon /> },
  ];

  return (
    <div className="user-menu-pop">
      <div onMouseLeave={() => themeStore.nextTheme(themeStore.theme)}>
        {themes.map(({ name, icon }) => (
          <div
            key={`theme-${name}`}
            className="user-menu-item"
            onMouseEnter={() => setColorScheme(name)}
            onClick={() => {
              themeStore.nextTheme(name);
              setToggle(toggles.main);
            }}
          >
            <div className={`user-menu-icon ${name}`}>{icon}</div> <div className="user-menu-title">{name} theme</div>
          </div>
        ))}
      </div>
      <div className="user-menu-separator" />
      <div className="user-menu-item" onClick={() => setToggle(toggles.main)}>
        <div className="user-menu-icon">
          <ChevronLeftIcon />
        </div>{' '}
        <div className="user-menu-title">Back</div>
      </div>
    </div>
  );
});
