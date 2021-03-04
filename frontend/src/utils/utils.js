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

const resizeBase64Img = (srcData, width, height) => {
  return new Promise((resolve, reject) => {
    let imageObj = document.createElement('img'),
      canvas = document.createElement('canvas'),
      ctx = canvas.getContext('2d'),
      xStart = 0,
      yStart = 0,
      aspectRadio,
      newWidth,
      newHeight;

    imageObj.src = srcData;
    canvas.width = width;
    canvas.height = height;

    imageObj.onload = () => {
      aspectRadio = imageObj.height / imageObj.width;

      if (imageObj.height < imageObj.width) {
        //horizontal
        aspectRadio = imageObj.width / imageObj.height;
        newHeight = height;
        newWidth = aspectRadio * height;
        xStart = -(newWidth - width) / 2;
      } else {
        //vertical
        newWidth = width;
        newHeight = aspectRadio * width;
        yStart = -(newHeight - height) / 2;
      }

      ctx.drawImage(imageObj, xStart, yStart, newWidth, newHeight);

      resolve(canvas.toDataURL('image/jpeg', 0.75));
    };
  });
};

export { FieldsObservable, networkCall, resizeBase64Img };
