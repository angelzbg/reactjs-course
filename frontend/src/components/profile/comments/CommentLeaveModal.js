import React from 'react';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react';
import WarningModal from '../../modals/WarningModal';

export default observer(({ toggleModal, modalRef, setModalRef, setContent }) => {
  const history = useHistory();
  return (
    <WarningModal
      title="Your comment won't be saved. Do you wish to continue?"
      onCancel={() => toggleModal(false)}
      onConfirm={() => {
        toggleModal(false);
        const href = modalRef;
        setModalRef('');
        setContent('');
        history.push(href);
      }}
    />
  );
});
