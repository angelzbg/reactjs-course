import { runInAction } from 'mobx';
import { networkCall, notify } from '../../utils/utils';

const auth = [
  'auth',
  ({ root, auth }) => ({
    signIn: async (body) => {
      runInAction(() => (root().isLoading = true));

      const response = await networkCall({ path: '/api/login', method: 'POST', body });

      if (response.okay) {
        auth().getUserInfo();
        notify(response);
      } else {
        runInAction(() => (root().isLoading = false));
      }

      return response;
    },

    signUp: async (body) => {
      runInAction(() => (root().isLoading = true));

      const response = await networkCall({ path: '/api/register', method: 'POST', body });

      if (response.okay) {
        notify(response);
        auth().getUserInfo();
      } else {
        runInAction(() => (root().isLoading = false));
      }

      return response;
    },

    signOut: async () => {
      runInAction(() => (root().isLoading = true));

      const response = await networkCall({ path: '/api/logout', method: 'GET' });

      if (response.okay) {
        runInAction(() => (root().isLoading = false));
        runInAction(() => (root().user = null));
      }

      notify(response);

      return response;
    },

    getUserInfo: async (isSilent) => {
      if (!isSilent) {
        runInAction(() => (root().isLoading = true));
      }

      const response = await networkCall({ path: '/api/userInfo', method: 'GET' });

      if (response.okay) {
        runInAction(() => {
          if (!root().user) {
            root().user = response.okay;
          } else {
            Object.assign(root().user, response.okay);
          }
        });
      }

      if (!isSilent) {
        runInAction(() => (root().isLoading = false));
      }

      if (response.error) {
        runInAction(() => (root().user = root().user === undefined ? null : undefined));
      }

      return response;
    },
  }),
];

export default auth;
