import { PersonIcon, ShieldLockIcon, ShieldIcon } from '@primer/octicons-react';

export const loginFields = [
  {
    name: 'logon',
    el: 'input',
    type: 'text',
    placeholder: 'Logon name',
    value: '',
    validate: (value) => !!value.length,
    errorMsg: 'Field is required',
    highlight: ['WRONG_CREDENTIALS'],
    icon: PersonIcon,
  },
  {
    name: 'password',
    el: 'input',
    type: 'password',
    placeholder: 'Password',
    value: '',
    validate: (value) => !!value.length,
    errorMsg: 'Field is required',
    highlight: ['WRONG_CREDENTIALS'],
    icon: ShieldLockIcon,
  },
];

export const registerFields = [
  {
    name: 'logon',
    el: 'input',
    type: 'text',
    placeholder: 'Logon name',
    value: '',
    validate: (value) => !!value.match(/^[0-9a-zA-Z]{3,}$/),
    errorMsg: '3 to 14 non special characters',
    highlight: ['LOGON_TAKEN'],
    icon: PersonIcon,
  },
  {
    name: 'password',
    el: 'input',
    type: 'password',
    placeholder: 'Password',
    value: '',
    validate: (value) => !!value.match(/^\S{5,}$/),
    errorMsg: '5+ non whitespace characters',
    icon: ShieldLockIcon,
  },
  {
    name: 'repeatPassword',
    el: 'input',
    type: 'password',
    placeholder: 'Repeat password',
    value: '',
    validate: (value, observable) => {
      const password = observable.fields.find(({ name }) => name === 'password').value;
      return password === value && !!password;
    },
    errorMsg: 'Dont match',
    icon: ShieldIcon,
  },
];
