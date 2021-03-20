import { io } from 'socket.io-client';
import events from '../../utils/events';

const ENDPOINT = '/';

let socket;
let socketId;

const listen = (id) => {
  if (!(socketId = id)) {
    return;
  }

  if (!socket) {
    socket = io(ENDPOINT);

    socket.on('friend-request-received', (data) => {
      const request = JSON.parse(data);
      events.trigger('friend-request-received', request);
    });

    socket.on('friend-request-accepted', (data) => {
      const { friend, removed } = JSON.parse(data);
      events.trigger('friend-request-accepted', { friend, removed });
    });

    socket.on('friend-request-removed', (data) => {
      const id = JSON.parse(data);
      events.trigger('friend-request-removed', id);
    });

    socket.on('friend-removed', (data) => {
      const id = JSON.parse(data);
      events.trigger('friend-removed', id);
    });

    socket.on('connect', () => {
      socket.emit('subscribeSocket', socketId);
    });
  } else {
    socket.emit('subscribeSocket', socketId);
  }
};

const close = () => {
  if (!socketId) {
    return;
  }

  socket.emit('unsubscribeSocket', socketId);
  socketId = undefined;
};

export { listen, close };
