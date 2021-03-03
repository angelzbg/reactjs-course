import React from 'react';
import { observer } from 'mobx-react';
import { useStore } from '../../store/store';
import { withRouter } from 'react-router';
import ProfileCard from './components/card/ProfileCard';

export default observer(
  withRouter(({ match }) => {
    const store = useStore();

    return (
      <>
        <ProfileCard id={match.params.id} />
      </>
    );
  })
);
