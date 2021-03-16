import { useLocalObservable } from 'mobx-react';
import events from './events';

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

const notify = (response) => events.trigger('notify', response);

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

const getTimeDifference = (date, now = new Date().getTime()) => {
  // get total seconds between the times
  let delta = Math.abs(date - now) / 1000;

  // calculate (and subtract) whole days
  const days = Math.floor(delta / 86400);
  delta -= days * 86400;
  if (days > 0) {
    if (days > 30) {
      const months = Math.floor(days % 30);
      if (months < 12) {
        return `${months > 1 ? 'a month' : `${months} months`} ago`;
      } else {
        const years = Math.floor(months % 12);
        return `${years > 1 ? `${years} years` : 'a year'} ago`;
      }
    } else if (days >= 7) {
      const weeks = Math.floor(days % 7);
      return `${weeks > 1 ? `${weeks} weeks` : 'a week'} ago`;
    } else {
      return `${days > 1 ? `${days} days` : 'a day'} ago`;
    }
  }

  // calculate (and subtract) whole hours
  const hours = Math.floor(delta / 3600) % 24;
  delta -= hours * 3600;
  if (hours > 0) {
    return `${hours > 1 ? `${hours} hours` : 'an hour'} ago`;
  }

  // calculate (and subtract) whole minutes
  const minutes = Math.floor(delta / 60) % 60;
  delta -= minutes * 60;
  if (minutes > 0) {
    return `${minutes > 1 ? `${minutes} minutes` : 'a minute'} ago`;
  }

  // what's left is seconds
  //const seconds = delta % 60; // in theory the modulus is not required
  return `just now`;
};

const screwEvent = (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (e.nativeEvent) {
    e.nativeEvent.preventDefault();
    e.nativeEvent.stopImmediatePropagation();
    e.nativeEvent.stopPropagation();
  }
};

const getHashFromEv = (e) => {
  const element =
    e.target && e.target.tagName === 'A'
      ? e.target
      : e.target && e.target.parentElement && e.target.parentElement.tagName === 'A'
      ? e.target.parentElement
      : e.target &&
        e.target.parentElement &&
        e.target.parentElement.parentElement &&
        e.target.parentElement.parentElement.tagName === 'A'
      ? e.target.parentElement.parentElement
      : e.currentTarget && e.currentTarget.tagName === 'A'
      ? e.currentTarget
      : e.currentTarget && e.currentTarget.parentElement && e.currentTarget.parentElement.tagName === 'A'
      ? e.currentTarget.parentElement
      : null;

  if (element) {
    return element.hash.substring(1);
  }
};

export { FieldsObservable, networkCall, notify, resizeBase64Img, getTimeDifference, screwEvent, getHashFromEv };
