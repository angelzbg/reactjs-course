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
  },
];

export const registerFields = [
  {
    name: 'logon',
    el: 'input',
    type: 'text',
    placeholder: 'Logon name',
    value: '',
    validate: (value) => value.length > 2,
    errorMsg: 'Must be at least 3 characters',
    highlight: ['USER_EXISTS'],
  },
  {
    name: 'password',
    el: 'input',
    type: 'password',
    placeholder: 'Password',
    value: '',
    validate: (value) => value.length > 4,
    errorMsg: 'Must be at least 5 characters',
  },
  {
    name: 'repeatPassword',
    el: 'input',
    type: 'password',
    placeholder: 'Repeat password',
    value: '',
    validate: (value, observable) => observable.fields[1].value === value && !!observable.fields[1].value,
    errorMsg: "Passwords don't match",
  },
];
