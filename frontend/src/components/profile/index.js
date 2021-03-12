import React from 'react';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router';
import ProfileCard from './card/index';
import Comments from './comments/index';
import Ratings from './ratings/index';

export default observer(
  withRouter(({ match }) => {
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
