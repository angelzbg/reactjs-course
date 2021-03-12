import Input from '../elements/Input';
import Select from '../elements/Select';
import { PersonIcon, ShieldLockIcon, ShieldIcon, FlameIcon, SmileyIcon, LocationIcon } from '@primer/octicons-react';

export const loginFields = [
  {
    component: Input,
    name: 'login',
    el: 'input',
    type: 'text',
    placeholder: 'Login name',
    value: '',
    validate: (value) => !!value.length,
    errorMsg: 'Field is required',
    highlight: ['WRONG_CREDENTIALS'],
    icon: PersonIcon,
  },
  {
    component: Input,
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
    component: Input,
    name: 'login',
    el: 'input',
    type: 'text',
    placeholder: 'Login name',
    value: '',
    validate: (value) => !!value.match(/^[0-9a-zA-Z]{3,}$/),
    errorMsg: '3 to 14 alphanumeric characters',
    highlight: ['LOGON_TAKEN'],
    icon: PersonIcon,
  },
  {
    component: Input,
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
    component: Input,
    name: 'repeatPassword',
    el: 'input',
    type: 'password',
    placeholder: 'Repeat password',
    value: '',
    validate: (value, observable) => {
      const password = observable.fields.find(({ name }) => name === 'password').value;
      return password === value && !!password;
    },
    errorMsg: "Don't match",
    icon: ShieldIcon,
  },
  {
    component: Select,
    name: 'type',
    el: 'select',
    placeholder: 'Account type...',
    value: '',
    values: ['Developer', 'Organization'],
    validate: (value) => !!value.length,
    errorMsg: 'Not selected',
    icon: FlameIcon,
  },
  {
    component: Input,
    name: 'name',
    el: 'input',
    type: 'text',
    placeholder: 'Name',
    value: '',
    validate: (value) => value.length > 1,
    errorMsg: '2+ characters',
    highlight: ['NAME_TAKEN'],
    icon: SmileyIcon,
  },
  {
    component: Input,
    name: 'city',
    el: 'input',
    type: 'text',
    placeholder: 'City',
    value: '',
    validate: (value) => !!value.length,
    errorMsg: 'Required',
    icon: LocationIcon,
  },
];
