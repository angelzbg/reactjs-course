const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { getId } = require('./utils/utils');

const User = require('./models/User.js');
const AccountRating = require('./models/Rating');

const PORT = 3000;
const connectionStr = 'mongodb://localhost:27017/webby';
const secret = 'testappwhocares';

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

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
    next();
  });
});

app.get('/api/profile/:id', async (req, res) => {
  const id = req.params.id;
  const profile = await User.findById(id).populate('ratings').lean();
  if (profile) {
    const { _id, city, created, type, name, avatar, rating, ratingRound, votes, stars } = profile;
    res.status(200).json({ okay: { _id, city, created, type, name, avatar, rating, ratingRound, votes, stars } });
    return;
  }

  res.status(200).json({ error: 'USER_PROFILE_NOT_FOUND' });
});

app.get('/api/userInfo', async (req, res) => {
  if (req.user) {
    const user = await User.findById(req.user.id).populate('ratings').lean();
    res.status(200).json({ okay: user });
  } else {
    res.status(200).json({ error: 'TOKEN_NOT_FOUND' });
  }
});

app.post('/api/rateUser/:id', async (req, res, next) => {
  if (!req.user) {
    res.status(200).json({ error: 'TOKEN_NOT_FOUND' });
  }

  const stars = parseInt(req.body.stars);
  const ratingUserId = req.user._id.toString();
  const ratedUserId = req.params.id;
  const ratedUser = await User.findById(ratedUserId);
  if (!ratedUser) {
    res.status(200).json({ error: 'USER_PROFILE_NOT_FOUND' });
  }

  const foundRating = await AccountRating.findOne({ userId: ratingUserId, accountId: ratedUserId });
  const created = new Date().getTime();
  if (foundRating) {
    const newStars = ratedUser.stars - (foundRating.stars - stars);
    const newRating = newStars / ratedUser.votes;
    const newRatingRound = Math.round(newRating);

    Promise.all([
      User.findByIdAndUpdate(ratedUserId, { stars: newStars, rating: newRating, ratingRound: newRatingRound }),
      AccountRating.findByIdAndUpdate(foundRating._id, { stars, created }),
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

  const found = await User.findById(id).lean();
  if (!found) {
    res.status(200).json({ error: 'USER_PROFILE_NOT_FOUND' });
    return;
  }

  let { name, city, avatar } = req.body;

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

      if (found.avatar) {
        require('fs').unlinkSync(`public/avatars/${found.avatar}`);
      }
    } catch (ex) {
      avatar = '';
    }

    await User.findByIdAndUpdate(id, { avatar });
    res.status(200).json({ okay: avatar });
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
    ...(avatar ? { avatar } : {}),
  });

  user.save((err) => {
    if (err) {
      res.status(200).json({ error: 'UNEXPECTED_ERROR' });
    } else {
      const payload = { login };
      const token = jwt.sign(payload, secret /*, { expiresIn: '1h' }*/);
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
          const payload = { login };
          const token = jwt.sign(payload, secret /*, { expiresIn: '1h' }*/);
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

mongoose
  .connect(connectionStr, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('Connected to database successfully!');
    app.listen(PORT, console.log(`Listening on port ${PORT} -> http://localhost:${PORT}`));
  });
