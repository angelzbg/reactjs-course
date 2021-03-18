import React from 'react';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router';
import ProfileCard from './card';
import Comments from './comments';
import Ratings from './ratings';

export default withRouter(
  observer(({ match }) => {
    const id = match.params.id;
    return (
      <>
        <ProfileCard {...{ id }} />
        <Comments {...{ id }} />
        <Ratings {...{ id }} />
      </>
    );
  })
);
