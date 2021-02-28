const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const User = require('./models/User.js');

const PORT = 3000;
const connectionStr = 'mongodb://localhost:27017/webby';
const secret = 'testappwhocares';

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
//app.use(express.static('public'));

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

    req.user = await User.findOne({ login: decoded.login }).lean();
    next();
  });
});

app.get('/api/userInfo', (req, res) => {
  if (req.user) {
    res.status(200).json({ okay: req.user });
  } else {
    res.status(200).json({ error: 'TOKEN_NOT_FOUND' });
  }
});

app.post('/api/register', async (req, res) => {
  const { login, password } = req.body;

  const found = await User.findOne({ login });
  if (found) {
    res.status(200).json({ error: 'LOGON_TAKEN' });
    return;
  }

  const user = new User({ login, password });
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
