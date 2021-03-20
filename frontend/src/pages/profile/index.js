import { withRouter } from 'react-router';
import ProfileCard from './card';
import Comments from './comments';
import Ratings from './ratings';

export default withRouter(({ match }) => {
  const id = match.params.id;
  return (
    <>
      <ProfileCard {...{ id }} />
      <Comments {...{ id }} />
      <Ratings {...{ id }} />
    </>
  );
});
