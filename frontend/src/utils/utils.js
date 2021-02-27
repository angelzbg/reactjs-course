import { useLocalObservable } from 'mobx-react';

const FieldsObservable = (fields = []) => {
  const observable = useLocalObservable(() => ({
    fields,
    error: false,
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
  }));

  return observable;
};

export { FieldsObservable };
