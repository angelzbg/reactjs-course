import { runInAction } from 'mobx';
import events from '../../utils/events';
import { networkCall, notify } from '../../utils/utils';

const profileStore = [
  'profileStore',
  ({ root, profileStore }) => ({
    loadingProfile: false,
    profile: null,
    getUserProfile: async (id = '') => {
      runInAction(() => {
        profileStore().loadingProfile = true;
        if (profileStore().profile && profileStore().profile._id !== id) {
          profileStore().profile = null;
        }
      });

      const response = await networkCall({ path: `/api/profile/${id}`, method: 'GET' });

      runInAction(() => {
        profileStore().profile = response.okay ?? null;
        profileStore().loadingProfile = false;
      });

      if (response.error) {
        notify(response);
      }

      return response;
    },

    updateUserProperty: async (property = '', value = '') => {
      const response = await networkCall({
        path: `/api/userInfo/${root().user._id}`,
        method: 'POST',
        body: { [property]: value },
      });

      if (response.error) {
        notify(response);
      } else {
        runInAction(() => {
          root().user[property] = response.okay;
          if (profileStore().profile && profileStore().profile._id === root().user._id) {
            profileStore().profile[property] = response.okay;
          }
        });
      }

      return response;
    },

    rateUser: async (stars = 1) => {
      const response = await networkCall({
        path: `/api/rateUser/${profileStore().profile._id}`,
        method: 'POST',
        body: { stars },
      });
      if (response.error) {
        notify(response);
      } else {
        events.trigger('rated', profileStore().profile._id);
      }

      return response;
    },

    loadingRatings: true,
    ratings: [],
    getRatings: async (id = '', inSync = false) => {
      if (!inSync) {
        runInAction(() => (profileStore().loadingRatings = true));
      }

      const response = await networkCall({ path: `/api/ratings/${id}`, method: 'GET' });
      runInAction(() => {
        profileStore().ratings = response.okay ?? [];
        profileStore().loadingRatings = false;
      });

      if (response.error) {
        notify(response);
      }

      return response;
    },

    commentUser: async (content = '') => {
      const response = await networkCall({
        path: `/api/comments/${profileStore()?.profile?._id ?? root().user._id}`,
        method: 'POST',
        body: { content },
      });
      if (response.error) {
        notify(response);
      } else {
        events.trigger('commented', profileStore().profile._id);
      }

      return response;
    },

    actionComment: async (action, id) => {
      const response = await networkCall({ path: `/api/comments/action/${id}`, method: 'POST', body: { action } });
      if (response.error) {
        notify(response);
      }

      return response;
    },

    loadingComments: true,
    comments: [],
    getComments: async (id = '', inSync = false) => {
      if (!inSync) {
        runInAction(() => (profileStore().loadingComments = true));
      }

      const response = await networkCall({ path: `/api/comments/${id}`, method: 'GET' });
      runInAction(() => {
        profileStore().comments = response.okay ?? [];
        profileStore().loadingComments = false;
      });

      if (response.error) {
        notify(response);
      }

      return response;
    },
  }),
];

export default profileStore;
