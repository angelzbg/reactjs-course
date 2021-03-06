import React from 'react';
import { observer } from 'mobx-react';
import { useStore } from '../../store/store';
import { withRouter } from 'react-router';
import ProfileCard from './components/card/ProfileCard';
import Comments from './components/comments/Comments';
import Ratings from './components/ratings/Ratings';

export default observer(
  withRouter(({ match }) => {
    const store = useStore();

    return (
      <>
        <ProfileCard id={match.params.id} />
        <Comments id={match.params.id} />
        <Ratings id={match.params.id} />
      </>
    );
  })
);
