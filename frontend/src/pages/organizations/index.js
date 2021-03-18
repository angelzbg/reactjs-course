import './styles/organizations.css';
import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useHistory, withRouter } from 'react-router';
import { useStore } from '../../store/store';
import Sync from './Sync';
import Filter from './Filter';
import OrganizationsLoader from '../../components/loaders/OrganizationsLoader';
import OrganizationsContainer from './OrganizationsContainer';

const Organizations = ({ match }) => {
  const history = useHistory();
  const section = match.params.section;
  const store = useStore();
  const { user, organizations } = store;

  useEffect(() => {
    if (!store.isLoading) {
      if (organizations.isValidFilter(section, !!user)) {
        organizations.setFilter(section);
      } else if (organizations.filter && section !== organizations.filter) {
        history.push(`/organizations/${organizations.filter}`);
      } else {
        history.push('/organizations/new');
      }
    }
  }, [store, user, section, organizations, history]);

  return (
    <>
      <Filter {...{ section }} />
      <Sync />
      {organizations.loading ? <OrganizationsLoader /> : <OrganizationsContainer {...{ section }} />}
    </>
  );
};

export default withRouter(observer(Organizations));
