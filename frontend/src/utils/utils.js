import { useLocalObservable } from 'mobx-react';

const FieldsObservable = (fields = []) => {
  const observable = useLocalObservable(() => ({
    fields,
    error: false,
    setError: (errorCode = '') => (observable.error = errorCode),
    setInput: (f = '', val = '') => {
      const field = observable.fields.find(({ name }) => name === f);
      field.value = val;
      field.error = false;
      observable.error = false;
    },
    validateFields: () => {
      let error = false;

      observable.fields.forEach((field) => {
        field.value = field.value.trim();
        const isValid = field.validate?.(field.value, observable) ?? true;
        field.error = !isValid;
        if (field.error) {
          error = true;
        }
      });

      return error;
    },
    getBody: () => Object.fromEntries(observable.fields.map(({ name, value }) => [name, value])),
  }));

  return observable;
};

const networkCall = async ({ path = '', method = '', body = {} }) => {
  const req = { method, headers: { 'Content-Type': 'application/json' } };

  if (method !== 'GET') {
    req.body = JSON.stringify(body);
  }

  return await (await fetch(path, req)).json();
};

export { FieldsObservable, networkCall };
