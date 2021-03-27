import { observer } from 'mobx-react';
import { useStore } from '../../store/store';
import { useEffect, useRef } from 'react';
import Events from '../../utils/events';
import { useResizeDetector } from 'react-resize-detector';
import { useChatObservable } from './constants';
import Header from './Header';
import MessageBox from './MessageBox';
import MessagesContainer from './MessagesContainer';

export default observer(({ chatId }) => {
  const store = useStore();
  const { activeChat, loadingChats, setActiveChat, chats } = store;
  const { inputHeight, ref: inputWrapRef } = useResizeDetector();
  const messageRef = useRef(null);
  const messageRefB = useRef(null);
  const observable = useChatObservable(store, messageRef);
  const { content, setContent, sendMessage, isSending } = observable;
  const chatUser = activeChat.chatUser;
  const messages = chats[chatId] || [];

  useEffect(() => {
    const canLoad = !loadingChats && store.activeChat && !store.loadingChatsIds[chatId];
    if (canLoad && store.chats[chatId]?.length === 1) {
      store.loadChatMessages(chatId, store.chats[chatId][0].created, true);
    }

    if (!loadingChats) {
      setTimeout(() => Events.trigger('scroll-to-bottom-chat', chatId), 20);
    }
  }, [store, chatId, loadingChats]);

  useEffect(() => {
    if (activeChat && messageRef?.current) {
      observable.setContent();
      messageRef.current.textContent = '';
    }
  }, [observable, activeChat, messageRef]);

  return (
    <div className="active-chat-wrapper">
      <Header {...{ chatUser, setActiveChat }} />
      <MessageBox {...{ chatId, content, setContent, isSending, sendMessage, inputWrapRef, messageRef, messageRefB }} />
      <MessagesContainer {...{ chatId, chatUser, messages, inputHeight }} />
    </div>
  );
});
