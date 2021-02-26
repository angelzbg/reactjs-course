import React from 'react';

import { observer } from 'mobx-react';

export default observer(({ className, value, name, type, placeholder, setInput }) => (
  <input
    className={className}
    name={name}
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={(e) => setInput(name, e.target.value)}
  />
));
