import { useLocalObservable } from 'mobx-react';

const FieldsObserver = (fields = []) => {
  const observable = useLocalObservable(() => ({
    fields,
    error: false,
    setInput: (f = '', val = '') => {
      const field = observable.fields.find(({ name }) => name === f);
      field.value = val.trim();
      field.error = false;
    },
    validateFields: () => {
      let error = false;

      observable.fields.forEach((field) => {
        const isValid = field.validate(field.value);
        field.error = !isValid;
        if (field.error) {
          error = true;
        }
      });

      return error;
    },
  }));

  return observable;
};

export { FieldsObserver };
