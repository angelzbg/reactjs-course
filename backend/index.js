const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const Events = require('./utils/events');
const { getId } = require('./utils/utils');
const uniqid = require('uniqid');

const User = require('./models/User.js');
const AccountRating = require('./models/Rating');
const ProfileComment = require('./models/ProfileComment');
const Friend = require('./models/Friend');
const FriendRequest = require('./models/FriendRequest');

const PORT = 3000;
const connectionStr = 'mongodb://localhost:27017/webby';
const secret = 'testappwhocares';

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors());

const signToken = (login) => {
  const payload = { login };
  const token = jwt.sign(payload, secret /*, { expiresIn: '1h' }*/);
  return token;
};

app.use((req, res, next) => {
  const token = req.cookies.token || req.headers.token; /*[authHeaderName]*/
  if (!token) {
    next();
    return;
  }

  jwt.verify(token, secret, async (err, decoded) => {
    if (err) {
      next(/*err*/);
      return;
    }

    req.user = await User.findOne({ login: decoded.login });
    req.token = token;
    next();
  });
});

app.post('/api/organizations', async (req, res, next) => {
  const skip = req.body.skip ?? 0;
  const limit = req.body.limit ?? 10;
  const filter = req.body.filter ?? '';
  const authFilters = ['new-local', 'top-local'];
  const city = req?.user?.city ?? '';
  if (!city && authFilters.includes(filter)) {
    res.status(200).json({ error: 'TOKEN_NOT_FOUND' });
    return;
  }

  if (!['new', 'top', 'new-local', 'top-local'].includes(filter)) {
    res.status(200).json({ error: 'INVALID_FILTER' });
    return;
  }

  const sorts = {
    new: { created: -1 },
    top: { rating: -1 },
    'new-local': { created: -1 },
    'top-local': { rating: -1 },
  };

  const selected = ['avatar', 'city', 'name', 'created', 'rating', 'ratingRound', 'stars', 'type', 'votes'];

  const result = await User.find(
    {
      type: 'Organization',
      ...(city && authFilters.includes(filter) ? { city } : {}),
      ...(['new', 'new-local'].includes(filter)
        ? { created: { $lt: parseInt(req.body.created ?? Number.MAX_SAFE_INTEGER) } }
        : {}),
    },
    selected,
    {
      ...(['top', 'top-local'].includes(filter) ? { skip } : {}),
      limit,
      sort: sorts[filter],
    }
  );

  res.status(200).json({ okay: result ?? [] });
});

app.post('/api/developers', async (req, res, next) => {
  const skip = req.body.skip ?? 0;
  const limit = req.body.limit ?? 10;
  const filter = req.body.filter ?? '';
  const authFilters = ['new-local', 'top-local'];
  const city = req?.user?.city ?? '';
  if (!city && authFilters.includes(filter)) {
    res.status(200).json({ error: 'TOKEN_NOT_FOUND' });
    return;
  }

  if (!['new', 'top', 'new-local', 'top-local'].includes(filter)) {
    res.status(200).json({ error: 'INVALID_FILTER' });
    return;
  }

  const sorts = {
    new: { created: -1 },
    top: { rating: -1 },
    'new-local': { created: -1 },
    'top-local': { rating: -1 },
  };

  const selected = ['avatar', 'city', 'name', 'created', 'rating', 'ratingRound', 'stars', 'type', 'votes'];

  const result = await User.find(
    {
      type: 'Developer',
      ...(city && authFilters.includes(filter) ? { city } : {}),
      ...(['new', 'new-local'].includes(filter)
        ? { created: { $lt: parseInt(req.body.created ?? Number.MAX_SAFE_INTEGER) } }
        : {}),
    },
    selected,
    {
      ...(['top', 'top-local'].includes(filter) ? { skip } : {}),
      limit,
      sort: sorts[filter],
    }
  );

  res.status(200).json({ okay: result ?? [] });
});

app.get('/api/home', async (req, res, next) => {
  let city;
  if (!!req.user) {
    city = req.user.city;
  }

  const selected = ['avatar', 'city', 'name', 'created', 'rating', 'ratingRound', 'stars', 'type', 'votes'];

  const result = await Promise.all([
    User.find({ type: 'Developer' }, selected, {
      skip: 0,
      limit: 10,
      sort: { rating: -1 },
    }),
    User.find({ type: 'Organization' }, selected, {
      skip: 0,
      limit: 10,
      sort: { rating: -1 },
    }),
    User.find({ type: 'Developer' }, selected, {
      skip: 0,
      limit: 10,
      sort: { created: -1 },
    }),
    User.find({ type: 'Organization' }, selected, {
      skip: 0,
      limit: 10,
      sort: { created: -1 },
    }),
    ...(city
      ? [
          User.find({ type: 'Developer', city }, selected, {
            skip: 0,
            limit: 10,
            sort: { rating: -1 },
          }),
          User.find({ type: 'Organization', city }, selected, {
            skip: 0,
            limit: 10,
            sort: { rating: -1 },
          }),
          User.find({ type: 'Developer', city }, selected, {
            skip: 0,
            limit: 10,
            sort: { created: -1 },
          }),
          User.find({ type: 'Organization', city }, selected, {
            skip: 0,
            limit: 10,
            sort: { created: -1 },
          }),
        ]
      : []),
  ]);

  res.status(200).json({
    okay: {
      topDevs: result[0] || [],
      topOrgs: result[1] || [],
      newDevs: result[2] || [],
      newOrgs: result[3] || [],
      topDevsNear: result[4] || [],
      topOrgsNear: result[5] || [],
      newDevsNear: result[6] || [],
      newOrgsNear: result[7] || [],
    },
  });
});

app.get('/api/send-friend-request/:id', async (req, res, next) => {
  if (!req.user) {
    res.status(200).json({ error: 'TOKEN_NOT_FOUND' });
    return;
  }

  const id = req.params.id;
  const foundUser = await User.findById(id);
  if (!foundUser) {
    res.status(200).json({ error: 'USER_PROFILE_NOT_FOUND' });
    return;
  }

  const foundFriendship = await Friend.findOne({ users: { $all: [req.user._id, foundUser._id] } });
  if (foundFriendship) {
    res.status(200).json({ error: 'USER_ALREADY_FRIENDED' });
    return;
  }

  const foundRequest = await FriendRequest.findOne({ sender: req.user._id, receiver: id });
  if (foundRequest) {
    res.status(200).json({ error: 'REQUEST_ALREADY_SENT_TO_USER' });
    return;
  } else {
    const friendRequest = new FriendRequest({
      sender: req.user._id,
      receiver: foundUser._id,
      created: new Date().getTime(),
    });
    friendRequest.save(async (err, doc) => {
      if (err) {
        res.status(200).json({ error: 'UNEXPECTED_ERROR' });
      } else {
        const data = {
          ...(() => {
            const { _id, created } = doc;
            return { _id, created };
          })(),
          sender: (() => {
            const { _id, city, created, type, name, avatar, rating, ratingRound, votes, stars } = req.user;
            return { _id, city, created, type, name, avatar, rating, ratingRound, votes, stars };
          })(),
          receiver: (() => {
            const { _id, city, created, type, name, avatar, rating, ratingRound, votes, stars } = foundUser;
            return { _id, city, created, type, name, avatar, rating, ratingRound, votes, stars };
          })(),
        };
        res.status(200).json({ okay: data });
        Events.trigger('emit', {
          id: foundUser.socketId,
          channel: 'friend-request-received',
          data,
        });
      }
    });
  }
});

app.get('/api/accept-friend-request/:id', async (req, res, next) => {
  if (!req.user) {
    res.status(200).json({ error: 'TOKEN_NOT_FOUND' });
    return;
  }

  const requestId = req.params.id;
  const foundRequest = await FriendRequest.findById(requestId);
  if (!foundRequest) {
    res.status(200).json({ error: 'FRIEND_REQUEST_NOT_FOUND' });
    return;
  }

  if (foundRequest.receiver.toString() !== req.user._id.toString()) {
    res.status(200).json({ error: 'UNAUTHORIZED_ACCESS' });
    return;
  }

  const users = [req.user._id, foundRequest.sender];
  const friendship = new Friend({ users, created: new Date().getTime() });
  friendship.save(async (err, doc) => {
    if (err) {
      res.status(200).json({ error: 'UNEXPECTED_ERROR' });
    } else {
      const senderId = foundRequest.sender;
      await FriendRequest.findByIdAndDelete(requestId);
      const sender = await User.findById(senderId)
        .populate('sender', '_id city created type name avatar rating ratingRound votes stars socketId')
        .lean();

      const data = {
        ...(() => {
          const { _id, created } = doc;
          return { _id, created };
        })(),
        users: [
          (() => {
            const { _id, city, created, type, name, avatar, rating, ratingRound, votes, stars } = req.user;
            return { _id, city, created, type, name, avatar, rating, ratingRound, votes, stars };
          })(),
          (() => {
            const { _id, city, created, type, name, avatar, rating, ratingRound, votes, stars } = sender;
            return { _id, city, created, type, name, avatar, rating, ratingRound, votes, stars };
          })(),
        ],
      };

      res.status(200).json({ okay: data });
      Events.trigger('emit', {
        id: sender.socketId,
        channel: 'friend-request-accepted',
        data: { friend: data, removed: requestId },
      });
    }
  });
});

app.get('/api/remove-friend-request/:id', async (req, res, next) => {
  if (!req.user) {
    res.status(200).json({ error: 'TOKEN_NOT_FOUND' });
    return;
  }

  const requestId = req.params.id;
  const foundRequest = await FriendRequest.findById(requestId)
    .populate('sender', '_id socketId')
    .populate('receiver', '_id socketId')
    .lean();

  if (!foundRequest) {
    res.status(200).json({ error: 'REQUEST_NOT_FOUND' });
    return;
  } else {
    let sender = req.user._id.toString() === foundRequest.sender._id.toString();
    let receiver = req.user._id.toString() === foundRequest.receiver._id.toString();
    if (sender || receiver) {
      const id = foundRequest._id.toString();
      await FriendRequest.findByIdAndDelete(id);
      res.status(200).json({ okay: 'REQUEST_REMOVED' });
      Events.trigger('emit', {
        id: sender ? foundRequest.receiver.socketId : foundRequest.sender.socketId,
        channel: 'friend-request-removed',
        data: id,
      });
    } else {
      res.status(200).json({ error: 'UNAUTHORIZED_ACCESS' });
    }
  }
});

app.get('/api/friends/remove/:id', async (req, res, next) => {
  if (!req.user) {
    res.status(200).json({ error: 'TOKEN_NOT_FOUND' });
    return;
  }

  const friendId = req.params.id;
  const foundFriend = await Friend.findById(friendId).populate('users', '_id socketId').lean();
  if (!foundFriend) {
    res.status(200).json({ error: 'FRIENDSHIP_NOT_FOUND' });
    return;
  }

  const isValid = foundFriend.users.find(({ _id }) => _id.toString() === req.user._id.toString());
  if (!isValid) {
    res.status(200).json({ error: 'UNAUTHORIZED_ACCESS' });
    return;
  }

  await Friend.findByIdAndDelete(friendId);
  res.status(200).json({ okay: 'FRIENDSHIP_REMOVED' });
  Events.trigger('emit', {
    id: foundFriend.users.find(({ _id }) => _id.toString() !== req.user._id.toString()).socketId,
    channel: 'friend-removed',
    data: friendId,
  });
});

app.get('/api/friends', async (req, res, next) => {
  if (!req.user) {
    res.status(200).json({ error: 'TOKEN_NOT_FOUND' });
    return;
  }

  const friends = await Friend.find({ users: req.user._id })
    .populate('users', '_id city created type name avatar rating ratingRound votes stars')
    .sort({ created: -1 })
    .lean();

  res.status(200).json({ okay: friends || [] });
});

app.get('/api/friend-requests', async (req, res, next) => {
  if (!req.user) {
    res.status(200).json({ error: 'TOKEN_NOT_FOUND' });
    return;
  }

  const friendRequests = await FriendRequest.find({
    $or: [{ sender: req.user._id }, { receiver: req.user._id }],
  })
    .populate('sender', '_id city created type name avatar rating ratingRound votes stars')
    .populate('receiver', '_id city created type name avatar rating ratingRound votes stars')
    .sort({ created: -1 })
    .lean();

  res.status(200).json({ okay: friendRequests || [] });
});

app.get('/api/profile/:id', async (req, res) => {
  const id = req.params.id;
  const profile = await User.findById(id).populate('ratings').lean();
  if (profile) {
    const { _id, city, created, type, name, avatar, rating, ratingRound, votes, stars } = profile;
    const okay = { _id, city, created, type, name, avatar, rating, ratingRound, votes, stars };

    /*if (req.user) {
      const friendRequest = await FriendRequest.findOne({
        $or: [
          { sender: req.user._id, receiver: id },
          { sender: id, receiver: req.user._id },
        ],
      });

      if (friendRequest) {
        okay.friendRequest = {
          type: friendRequest.sender.toString() === req.user._id.toString() ? 'sender' : 'receiver',
          id: friendRequest._id,
        };
      }
    }*/

    res.status(200).json({ okay });
    return;
  }

  res.status(200).json({ error: 'USER_PROFILE_NOT_FOUND' });
});

app.get('/api/userInfo', (req, res) => {
  if (req.user) {
    const { _id, city, created, type, name, avatar, rating, ratingRound, votes, stars } = req.user;
    const { lastNotifCheck, socketId } = req.user;
    res.status(200).json({
      okay: { _id, city, created, type, name, avatar, rating, ratingRound, votes, stars, lastNotifCheck, socketId },
    });
  } else {
    res.status(200).json({ error: 'TOKEN_NOT_FOUND' });
  }
});

app.post('/api/comments/action/:id', async (req, res, next) => {
  if (!req.user) {
    res.status(200).json({ error: 'TOKEN_NOT_FOUND' });
    return;
  }

  const id = req.params.id;
  const action = req.body.action;

  if (action === 'delete') {
    const found = await ProfileComment.findById(id);
    if (!found) {
      res.status(200).json({ error: 'COMMENT_NOT_FOUND' });
      return;
    }

    if (found.userId.toString() !== req.user._id.toString()) {
      res.status(200).json({ error: 'COMMENT_AUTHOR_NOT_MATCHING' });
      return;
    }

    ProfileComment.findByIdAndDelete(id, (err, docs) => {
      if (err) {
        res.status(200).json({ error: 'UNEXPECTED_ERROR' });
      } else {
        res.status(200).json({ okay: 'COMMENT_DELETED' });
      }
    });
    return;
  }

  if (!['like', 'dislike'].includes(action)) {
    res.status(200).json({ error: 'COMMENT_ACTION_NOT_PROVIDED' });
    return;
  }

  ProfileComment.findByIdAndUpdate(
    id,
    {
      $pull: { [action === 'like' ? 'dislikes' : 'likes']: req.user._id },
      $push: { [action === 'like' ? 'likes' : 'dislikes']: req.user._id },
    },
    (err, result) => {
      if (err) {
        res.status(200).json({ error: 'COMMENT_NOT_FOUND' });
      } else {
        res.status(200).json({ okay: 'COMMENT_ACTION_SUCCESS' });
      }
    }
  );
});

app.get('/api/comments/:id', async (req, res, next) => {
  const accountId = req.params.id;
  const comments = await ProfileComment.find({ accountId })
    .populate('userId', 'avatar city name created rating ratingRound stars type votes')
    .lean();
  res.status(200).json({ okay: comments ?? [] });
});

app.post('/api/comments/:id', async (req, res, next) => {
  const accountId = req.params.id;
  if (!req.user) {
    res.status(200).json({ error: 'TOKEN_NOT_FOUND' });
    return;
  }

  const { content } = req.body;
  if (!content || content.length < 10 || content.length > 255) {
    res.status(200).json({ error: 'COMMENT_CONTENT_ERROR' });
    return;
  }

  const userId = req.user._id.toString();
  const profile = await User.findById(accountId);
  if (!profile) {
    res.status(200).json({ error: 'USER_PROFILE_NOT_FOUND' });
    return;
  }

  const created = new Date().getTime();

  const profileComment = new ProfileComment({ userId, accountId, content, created });
  profileComment.save(async (err, doc) => {
    if (err) {
      res.status(200).json({ error: 'UNEXPECTED_ERROR' });
    } else {
      res.status(200).json({ okay: 'USER_PROFILE_COMMENTED' });
    }
  });
});

app.get('/api/ratings/:id', async (req, res, next) => {
  const accountId = req.params.id;
  const ratings = await AccountRating.find({ accountId })
    .populate('userId', 'avatar city name created rating ratingRound stars type votes')
    .lean();
  res.status(200).json({ okay: ratings ?? [] });
});

// SHOULD BE DONE WITH INCREMENT AND ROUNDED ON THE FRONTEND
app.post('/api/rateUser/:id', async (req, res, next) => {
  if (!req.user) {
    res.status(200).json({ error: 'TOKEN_NOT_FOUND' });
    return;
  }

  let stars = parseInt(req.body.stars ?? 5);
  if (stars < 1) {
    stars = 1;
  } else if (stars > 5) {
    stars = 5;
  }

  const ratingUserId = req.user._id.toString();
  const ratedUserId = req.params.id;
  const ratedUser = await User.findById(ratedUserId);
  if (!ratedUser) {
    res.status(200).json({ error: 'USER_PROFILE_NOT_FOUND' });
    return;
  }

  const foundRating = await AccountRating.findOne({ userId: ratingUserId, accountId: ratedUserId });
  const created = new Date().getTime();
  if (foundRating) {
    const newStars = ratedUser.stars - (foundRating.stars - stars);
    const newRating = newStars / ratedUser.votes;
    const newRatingRound = Math.round(newRating);

    Promise.all([
      User.findByIdAndUpdate(ratedUserId, { stars: newStars, rating: newRating, ratingRound: newRatingRound }),
      AccountRating.findByIdAndUpdate(foundRating._id, { stars, ...(foundRating.stars !== stars ? { created } : {}) }),
    ])
      .then(() => res.status(200).json({ okay: 'USER_PROFILE_RATED' }))
      .catch(next);
  } else {
    const accountRating = new AccountRating({ userId: ratingUserId, accountId: ratedUserId, stars, created });
    accountRating.save(async (err, doc) => {
      if (err) {
        res.status(200).json({ error: 'UNEXPECTED_ERROR' });
      } else {
        const newVotes = ratedUser.votes + 1;
        const newStars = ratedUser.stars + stars;
        const newRating = newStars / newVotes;
        const newRatingRound = Math.round(newRating);
        await User.findByIdAndUpdate(ratedUserId, {
          votes: newVotes,
          stars: newStars,
          rating: newRating,
          ratingRound: newRatingRound,
        });
        res.status(200).json({ okay: 'USER_PROFILE_RATED' });
      }
    });
  }
});

app.post('/api/userInfo/:id', async (req, res) => {
  const id = req.params.id;

  if (!req.user || req.user._id.toString() !== id) {
    res.status(200).json({ error: 'TOKEN_NOT_FOUND' });
    return;
  }

  let { name, city, avatar, lastNotifCheck } = req.body;

  if (name) {
    await User.findByIdAndUpdate(id, { name });
    res.status(200).json({ okay: name });
    return;
  } else if (city) {
    await User.findByIdAndUpdate(id, { city });
    res.status(200).json({ okay: city });
    return;
  } else if (avatar) {
    const imgId = getId();
    try {
      require('fs').writeFileSync(
        `public/avatars/${imgId}.jpg`,
        avatar.replace(/^data:image\/jpeg;base64,/, ''),
        'base64'
      );
      avatar = `${imgId}.jpg`;

      if (req.user.avatar) {
        require('fs').unlinkSync(`public/avatars/${req.user.avatar}`);
      }
    } catch (ex) {
      avatar = '';
    }

    await User.findByIdAndUpdate(id, { avatar });
    res.status(200).json({ okay: avatar });
    return;
  } else if (lastNotifCheck) {
    const date = new Date().getTime();
    await User.findByIdAndUpdate(id, { lastNotifCheck: date });
    res.status(200).json({ okay: date });
    return;
  }

  res.status(200).json({ error: 'UNEXPECTED_ERROR' });
});

app.post('/api/register', async (req, res) => {
  let { login, password, type, name, avatar, city } = req.body;
  const found = await User.findOne({ login });
  if (found) {
    res.status(200).json({ error: 'LOGON_TAKEN' });
    return;
  }

  if (avatar) {
    const id = getId();
    try {
      require('fs').writeFileSync(
        `public/avatars/${id}.jpg`,
        avatar.replace(/^data:image\/jpeg;base64,/, ''),
        'base64'
      );
      avatar = `${id}.jpg`;
    } catch (ex) {
      avatar = '';
    }
  }

  const user = new User({
    login,
    password,
    type,
    name,
    city,
    created: new Date().getTime(),
    socketId: uniqid() + uniqid(),
    ...(avatar ? { avatar } : {}),
  });

  user.save((err) => {
    if (err) {
      res.status(200).json({ error: 'UNEXPECTED_ERROR' });
    } else {
      const token = signToken(login);
      res.cookie('token', token, { httpOnly: true });
      res.status(200).json({ okay: 'REGISTER_SUCCESSFUL' });
    }
  });
});

app.post('/api/login', (req, res) => {
  const { login, password } = req.body;
  User.findOne({ login }, (err, user) => {
    if (err) {
      console.error(err);
      res.status(200).json({ error: 'UNEXPECTED_ERROR' });
    } else if (!user) {
      res.status(200).json({ error: 'WRONG_CREDENTIALS' });
    } else {
      user.isCorrectPassword(password, (err, same) => {
        if (err) {
          res.status(200).json({ error: 'UNEXPECTED_ERROR' });
        } else if (!same) {
          res.status(200).json({ error: 'WRONG_CREDENTIALS' });
        } else {
          const token = signToken(login);
          res.cookie('token', token, { httpOnly: true });
          res.status(200).json({ okay: 'LOGIN_SUCCESSFUL' });
        }
      });
    }
  });
});

app.get('/api/logout', (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ okay: 'LOGOUT_SUCCESSFUL' });
});

app.use((err, _, res, _1) => {
  if (err) {
    console.log(err);
    res.status(200).json({ error: 'UNEXPECTED_ERROR' });
  }
});

const sockets = {};

io.on('connection', (socket) => {
  let socketId;
  socket.on('subscribeSocket', (id) => {
    socketId = id;
    sockets[socketId] = (sockets[socketId] || []).concat(socket);
  });
  socket.on('disconnect', () => {
    if (sockets[socketId]) {
      sockets[socketId] = sockets[socketId].filter((s) => s.id !== socket.id);
      if (!sockets[socketId].length) {
        delete sockets[socketId];
      }
    }
  });
  socket.on('unsubscribeSocket', () => {
    if (sockets[socketId]) {
      sockets[socketId] = sockets[socketId].filter((s) => s.id !== socket.id);
      if (!sockets[socketId].length) {
        delete sockets[socketId];
      }
    }
  });
});

Events.listen('emit', 'sockets', ({ id, channel, data }) =>
  sockets[id]?.forEach((s) => s.emit(channel, JSON.stringify(data)))
);

mongoose
  .connect(connectionStr, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('Connected to database successfully!');
    http.listen(PORT, console.log(`Listening on port ${PORT} -> http://localhost:${PORT}`));
  });
