const jwt = require('jsonwebtoken');

const getId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

const signToken = (login) => {
  const payload = { login };
  const token = jwt.sign(payload, secret /*, { expiresIn: '1h' }*/);
  return token;
};

module.exports = { getId, signToken };
