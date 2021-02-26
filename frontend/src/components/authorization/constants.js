export const loginFields = [
  {
    name: 'logon',
    el: 'input',
    type: 'text',
    placeholder: 'Logon name',
    value: '',
    validate: (value) => !!value.length,
    errorMsg: 'Field is required',
  },
  {
    name: 'password',
    el: 'input',
    type: 'password',
    placeholder: 'Password',
    value: '',
    validate: (value) => !!value.length,
    errorMsg: 'Field is required',
  },
];
